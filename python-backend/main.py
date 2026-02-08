from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from bson import ObjectId
import pandas as pd
import numpy as np
from io import BytesIO
import json

# Settings
class Settings(BaseSettings):
    mongodb_uri: str = "mongodb://localhost:27017"
    database_name: str = "erp_system"
    jwt_secret: str = "your-secret-key"
    
    class Config:
        env_file = ".env"

settings = Settings()

# Initialize FastAPI
app = FastAPI(
    title="ERP System Analytics API",
    description="Python FastAPI backend for advanced analytics and report generation",
    version="1.0.0",
    docs_url="/api/py/docs",
    redoc_url="/api/py/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
@app.on_event("startup")
async def startup_db():
    app.mongodb_client = AsyncIOMotorClient(settings.mongodb_uri)
    app.mongodb = app.mongodb_client[settings.database_name]
    print("✅ Connected to MongoDB from Python backend")

@app.on_event("shutdown")
async def shutdown_db():
    app.mongodb_client.close()

# Helper function to serialize MongoDB documents
def serialize_doc(doc):
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(d) for d in doc]
    if isinstance(doc, dict):
        return {k: serialize_doc(v) for k, v in doc.items()}
    if isinstance(doc, ObjectId):
        return str(doc)
    if isinstance(doc, datetime):
        return doc.isoformat()
    return doc

# ==================== HEALTH CHECK ====================

@app.get("/api/py/health")
async def health_check():
    return {
        "status": "ok",
        "service": "ERP Analytics API (Python)",
        "timestamp": datetime.now().isoformat()
    }

# ==================== ANALYTICS ENDPOINTS ====================

@app.get("/api/py/analytics/overview")
async def get_analytics_overview():
    """Get comprehensive analytics overview"""
    try:
        db = app.mongodb
        
        # Student statistics
        total_students = await db.students.count_documents({})
        active_students = await db.students.count_documents({"academicInfo.status": "active"})
        
        # Course distribution
        course_pipeline = [
            {"$match": {"academicInfo.status": "active"}},
            {"$group": {"_id": "$academicInfo.course", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        course_dist = await db.students.aggregate(course_pipeline).to_list(None)
        
        # Fee collection
        fee_pipeline = [
            {"$group": {
                "_id": None,
                "totalAmount": {"$sum": "$totalAmount"},
                "collectedAmount": {"$sum": "$paidAmount"},
                "pendingAmount": {"$sum": "$pendingAmount"}
            }}
        ]
        fee_stats = await db.fees.aggregate(fee_pipeline).to_list(None)
        
        # Hostel occupancy
        hostel_pipeline = [
            {"$group": {
                "_id": None,
                "totalCapacity": {"$sum": "$capacity"},
                "currentOccupancy": {"$sum": "$currentOccupancy"}
            }}
        ]
        hostel_stats = await db.rooms.aggregate(hostel_pipeline).to_list(None)
        
        # Admission stats
        admission_pipeline = [
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ]
        admission_stats = await db.admissions.aggregate(admission_pipeline).to_list(None)
        
        return {
            "students": {
                "total": total_students,
                "active": active_students,
                "courseDistribution": serialize_doc(course_dist)
            },
            "fees": serialize_doc(fee_stats[0]) if fee_stats else {
                "totalAmount": 0, "collectedAmount": 0, "pendingAmount": 0
            },
            "hostel": serialize_doc(hostel_stats[0]) if hostel_stats else {
                "totalCapacity": 0, "currentOccupancy": 0
            },
            "admissions": serialize_doc(admission_stats)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/py/analytics/trends")
async def get_trends(
    period: str = Query("6m", description="Period: 3m, 6m, 12m, all"),
    metric: str = Query("all", description="Metric: students, fees, admissions, all")
):
    """Get trend data for various metrics"""
    try:
        db = app.mongodb
        
        # Calculate date range
        now = datetime.now()
        if period == "3m":
            start_date = now - timedelta(days=90)
        elif period == "6m":
            start_date = now - timedelta(days=180)
        elif period == "12m":
            start_date = now - timedelta(days=365)
        else:
            start_date = datetime(2020, 1, 1)
        
        results = {}
        
        # Student enrollment trend
        if metric in ["students", "all"]:
            student_trend = await db.students.aggregate([
                {"$match": {"createdAt": {"$gte": start_date}}},
                {"$group": {
                    "_id": {
                        "year": {"$year": "$createdAt"},
                        "month": {"$month": "$createdAt"}
                    },
                    "count": {"$sum": 1}
                }},
                {"$sort": {"_id.year": 1, "_id.month": 1}}
            ]).to_list(None)
            results["studentTrend"] = serialize_doc(student_trend)
        
        # Fee collection trend
        if metric in ["fees", "all"]:
            fee_trend = await db.payments.aggregate([
                {"$match": {"paymentDate": {"$gte": start_date}, "status": "completed"}},
                {"$group": {
                    "_id": {
                        "year": {"$year": "$paymentDate"},
                        "month": {"$month": "$paymentDate"}
                    },
                    "total": {"$sum": "$amount"}
                }},
                {"$sort": {"_id.year": 1, "_id.month": 1}}
            ]).to_list(None)
            results["feeTrend"] = serialize_doc(fee_trend)
        
        # Admission trend
        if metric in ["admissions", "all"]:
            admission_trend = await db.admissions.aggregate([
                {"$match": {"createdAt": {"$gte": start_date}}},
                {"$group": {
                    "_id": {
                        "year": {"$year": "$createdAt"},
                        "month": {"$month": "$createdAt"},
                        "status": "$status"
                    },
                    "count": {"$sum": 1}
                }},
                {"$sort": {"_id.year": 1, "_id.month": 1}}
            ]).to_list(None)
            results["admissionTrend"] = serialize_doc(admission_trend)
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/py/analytics/predictions")
async def get_predictions():
    """Get simple predictions based on historical data"""
    try:
        db = app.mongodb
        
        # Get last 6 months of student data
        six_months_ago = datetime.now() - timedelta(days=180)
        
        student_data = await db.students.aggregate([
            {"$match": {"createdAt": {"$gte": six_months_ago}}},
            {"$group": {
                "_id": {
                    "year": {"$year": "$createdAt"},
                    "month": {"$month": "$createdAt"}
                },
                "count": {"$sum": 1}
            }},
            {"$sort": {"_id.year": 1, "_id.month": 1}}
        ]).to_list(None)
        
        # Simple linear prediction
        if len(student_data) >= 2:
            counts = [d["count"] for d in student_data]
            avg_growth = sum(counts[i+1] - counts[i] for i in range(len(counts)-1)) / (len(counts)-1)
            predicted_next = counts[-1] + avg_growth
        else:
            predicted_next = 0
            avg_growth = 0
        
        # Fee prediction
        fee_data = await db.payments.aggregate([
            {"$match": {"paymentDate": {"$gte": six_months_ago}, "status": "completed"}},
            {"$group": {
                "_id": {
                    "year": {"$year": "$paymentDate"},
                    "month": {"$month": "$paymentDate"}
                },
                "total": {"$sum": "$amount"}
            }},
            {"$sort": {"_id.year": 1, "_id.month": 1}}
        ]).to_list(None)
        
        if len(fee_data) >= 2:
            totals = [d["total"] for d in fee_data]
            avg_fee_growth = sum(totals[i+1] - totals[i] for i in range(len(totals)-1)) / (len(totals)-1)
            predicted_fee = totals[-1] + avg_fee_growth
        else:
            predicted_fee = 0
            avg_fee_growth = 0
        
        return {
            "enrollment": {
                "nextMonthPrediction": max(0, round(predicted_next)),
                "averageGrowth": round(avg_growth, 2),
                "trend": "up" if avg_growth > 0 else "down" if avg_growth < 0 else "stable"
            },
            "feeCollection": {
                "nextMonthPrediction": max(0, round(predicted_fee)),
                "averageGrowth": round(avg_fee_growth, 2),
                "trend": "up" if avg_fee_growth > 0 else "down" if avg_fee_growth < 0 else "stable"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== REPORT GENERATION ====================

@app.get("/api/py/reports/students/export")
async def export_students(
    format: str = Query("csv", description="Export format: csv, excel"),
    status: Optional[str] = None,
    course: Optional[str] = None
):
    """Export student data to CSV or Excel"""
    try:
        db = app.mongodb
        
        query = {}
        if status:
            query["academicInfo.status"] = status
        if course:
            query["academicInfo.course"] = course
        
        students = await db.students.find(query).to_list(None)
        
        if not students:
            raise HTTPException(status_code=404, detail="No students found")
        
        # Prepare data for export
        data = []
        for s in students:
            data.append({
                "Student ID": s.get("studentId", ""),
                "First Name": s.get("personalInfo", {}).get("firstName", ""),
                "Last Name": s.get("personalInfo", {}).get("lastName", ""),
                "Email": s.get("personalInfo", {}).get("email", ""),
                "Phone": s.get("personalInfo", {}).get("phone", ""),
                "Course": s.get("academicInfo", {}).get("course", ""),
                "Semester": s.get("academicInfo", {}).get("semester", ""),
                "Status": s.get("academicInfo", {}).get("status", ""),
                "Enrollment Date": s.get("academicInfo", {}).get("enrollmentDate", ""),
                "Hostel Resident": "Yes" if s.get("hostelInfo", {}).get("isHostelResident") else "No"
            })
        
        df = pd.DataFrame(data)
        
        if format == "excel":
            output = BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='Students')
            output.seek(0)
            
            return StreamingResponse(
                output,
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                headers={"Content-Disposition": f"attachment; filename=students_{datetime.now().strftime('%Y%m%d')}.xlsx"}
            )
        else:
            output = BytesIO()
            df.to_csv(output, index=False)
            output.seek(0)
            
            return StreamingResponse(
                output,
                media_type="text/csv",
                headers={"Content-Disposition": f"attachment; filename=students_{datetime.now().strftime('%Y%m%d')}.csv"}
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/py/reports/fees/export")
async def export_fees(
    format: str = Query("csv", description="Export format: csv, excel"),
    status: Optional[str] = None,
    academic_year: Optional[str] = None
):
    """Export fee data to CSV or Excel"""
    try:
        db = app.mongodb
        
        pipeline = []
        
        match_stage = {}
        if status:
            match_stage["status"] = status
        if academic_year:
            match_stage["academicYear"] = academic_year
        
        if match_stage:
            pipeline.append({"$match": match_stage})
        
        pipeline.extend([
            {"$lookup": {
                "from": "students",
                "localField": "studentId",
                "foreignField": "_id",
                "as": "student"
            }},
            {"$unwind": {"path": "$student", "preserveNullAndEmptyArrays": True}}
        ])
        
        fees = await db.fees.aggregate(pipeline).to_list(None)
        
        if not fees:
            raise HTTPException(status_code=404, detail="No fee records found")
        
        data = []
        for f in fees:
            student = f.get("student", {})
            data.append({
                "Student ID": student.get("studentId", ""),
                "Student Name": f"{student.get('personalInfo', {}).get('firstName', '')} {student.get('personalInfo', {}).get('lastName', '')}",
                "Academic Year": f.get("academicYear", ""),
                "Semester": f.get("semester", ""),
                "Total Amount": f.get("totalAmount", 0),
                "Paid Amount": f.get("paidAmount", 0),
                "Pending Amount": f.get("pendingAmount", 0),
                "Status": f.get("status", ""),
                "Due Date": f.get("dueDate", "")
            })
        
        df = pd.DataFrame(data)
        
        if format == "excel":
            output = BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='Fees')
            output.seek(0)
            
            return StreamingResponse(
                output,
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                headers={"Content-Disposition": f"attachment; filename=fees_{datetime.now().strftime('%Y%m%d')}.xlsx"}
            )
        else:
            output = BytesIO()
            df.to_csv(output, index=False)
            output.seek(0)
            
            return StreamingResponse(
                output,
                media_type="text/csv",
                headers={"Content-Disposition": f"attachment; filename=fees_{datetime.now().strftime('%Y%m%d')}.csv"}
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/py/reports/payments/export")
async def export_payments(
    format: str = Query("csv", description="Export format: csv, excel"),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    payment_method: Optional[str] = None
):
    """Export payment data to CSV or Excel"""
    try:
        db = app.mongodb
        
        query = {"status": "completed"}
        
        if start_date or end_date:
            query["paymentDate"] = {}
            if start_date:
                query["paymentDate"]["$gte"] = datetime.fromisoformat(start_date)
            if end_date:
                query["paymentDate"]["$lte"] = datetime.fromisoformat(end_date)
        
        if payment_method:
            query["paymentMethod"] = payment_method
        
        pipeline = [
            {"$match": query},
            {"$lookup": {
                "from": "students",
                "localField": "studentId",
                "foreignField": "_id",
                "as": "student"
            }},
            {"$unwind": {"path": "$student", "preserveNullAndEmptyArrays": True}},
            {"$sort": {"paymentDate": -1}}
        ]
        
        payments = await db.payments.aggregate(pipeline).to_list(None)
        
        if not payments:
            raise HTTPException(status_code=404, detail="No payments found")
        
        data = []
        for p in payments:
            student = p.get("student", {})
            data.append({
                "Receipt Number": p.get("receiptNumber", ""),
                "Student ID": student.get("studentId", ""),
                "Student Name": f"{student.get('personalInfo', {}).get('firstName', '')} {student.get('personalInfo', {}).get('lastName', '')}",
                "Amount": p.get("amount", 0),
                "Payment Method": p.get("paymentMethod", ""),
                "Payment Date": p.get("paymentDate", ""),
                "Academic Year": p.get("academicYear", ""),
                "Semester": p.get("semester", ""),
                "Status": p.get("status", "")
            })
        
        df = pd.DataFrame(data)
        
        if format == "excel":
            output = BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='Payments')
            output.seek(0)
            
            return StreamingResponse(
                output,
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                headers={"Content-Disposition": f"attachment; filename=payments_{datetime.now().strftime('%Y%m%d')}.xlsx"}
            )
        else:
            output = BytesIO()
            df.to_csv(output, index=False)
            output.seek(0)
            
            return StreamingResponse(
                output,
                media_type="text/csv",
                headers={"Content-Disposition": f"attachment; filename=payments_{datetime.now().strftime('%Y%m%d')}.csv"}
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/py/reports/hostel/occupancy")
async def get_hostel_occupancy_report():
    """Get detailed hostel occupancy report"""
    try:
        db = app.mongodb
        
        # Block-wise occupancy
        block_stats = await db.rooms.aggregate([
            {"$group": {
                "_id": "$block",
                "totalRooms": {"$sum": 1},
                "totalCapacity": {"$sum": "$capacity"},
                "currentOccupancy": {"$sum": "$currentOccupancy"},
                "available": {
                    "$sum": {"$subtract": ["$capacity", "$currentOccupancy"]}
                }
            }},
            {"$sort": {"_id": 1}}
        ]).to_list(None)
        
        # Room type distribution
        type_stats = await db.rooms.aggregate([
            {"$group": {
                "_id": "$roomType",
                "count": {"$sum": 1},
                "totalCapacity": {"$sum": "$capacity"},
                "occupied": {"$sum": "$currentOccupancy"}
            }}
        ]).to_list(None)
        
        # Status distribution
        status_stats = await db.rooms.aggregate([
            {"$group": {
                "_id": "$status",
                "count": {"$sum": 1}
            }}
        ]).to_list(None)
        
        # Calculate overall occupancy rate
        overall = await db.rooms.aggregate([
            {"$group": {
                "_id": None,
                "totalCapacity": {"$sum": "$capacity"},
                "currentOccupancy": {"$sum": "$currentOccupancy"}
            }}
        ]).to_list(None)
        
        occupancy_rate = 0
        if overall and overall[0]["totalCapacity"] > 0:
            occupancy_rate = (overall[0]["currentOccupancy"] / overall[0]["totalCapacity"]) * 100
        
        return {
            "overallOccupancyRate": round(occupancy_rate, 2),
            "totalCapacity": overall[0]["totalCapacity"] if overall else 0,
            "currentOccupancy": overall[0]["currentOccupancy"] if overall else 0,
            "blockWiseStats": serialize_doc(block_stats),
            "roomTypeStats": serialize_doc(type_stats),
            "statusDistribution": serialize_doc(status_stats)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/py/reports/financial/summary")
async def get_financial_summary(
    academic_year: Optional[str] = None
):
    """Get comprehensive financial summary"""
    try:
        db = app.mongodb
        
        match_stage = {}
        if academic_year:
            match_stage["academicYear"] = academic_year
        
        # Fee summary
        fee_pipeline = [
            {"$match": match_stage} if match_stage else {"$match": {}},
            {"$group": {
                "_id": None,
                "totalDue": {"$sum": "$totalAmount"},
                "totalCollected": {"$sum": "$paidAmount"},
                "totalPending": {"$sum": "$pendingAmount"}
            }}
        ]
        fee_summary = await db.fees.aggregate(fee_pipeline).to_list(None)
        
        # Payment method breakdown
        payment_pipeline = [
            {"$match": {"status": "completed"}},
            {"$group": {
                "_id": "$paymentMethod",
                "total": {"$sum": "$amount"},
                "count": {"$sum": 1}
            }},
            {"$sort": {"total": -1}}
        ]
        payment_breakdown = await db.payments.aggregate(payment_pipeline).to_list(None)
        
        # Monthly collection (current year)
        current_year = datetime.now().year
        monthly_pipeline = [
            {"$match": {
                "status": "completed",
                "paymentDate": {
                    "$gte": datetime(current_year, 1, 1),
                    "$lte": datetime(current_year, 12, 31)
                }
            }},
            {"$group": {
                "_id": {"$month": "$paymentDate"},
                "total": {"$sum": "$amount"}
            }},
            {"$sort": {"_id": 1}}
        ]
        monthly_collection = await db.payments.aggregate(monthly_pipeline).to_list(None)
        
        # Overdue fees
        today = datetime.now()
        overdue_fees = await db.fees.count_documents({
            "status": {"$in": ["pending", "partial"]},
            "dueDate": {"$lt": today}
        })
        
        return {
            "summary": serialize_doc(fee_summary[0]) if fee_summary else {
                "totalDue": 0, "totalCollected": 0, "totalPending": 0
            },
            "paymentMethodBreakdown": serialize_doc(payment_breakdown),
            "monthlyCollection": serialize_doc(monthly_collection),
            "overdueCount": overdue_fees,
            "collectionRate": round(
                (fee_summary[0]["totalCollected"] / fee_summary[0]["totalDue"] * 100)
                if fee_summary and fee_summary[0]["totalDue"] > 0 else 0, 2
            )
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run with: uvicorn main:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
