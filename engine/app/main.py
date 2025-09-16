from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
import sqlite3

import json

app = FastAPI()


app.add_middleware( CORSMiddleware,allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/")
async def read_root():
    return {"Server running"}


@app.post("/api/save-workflow")
async def save_workflow(workflow: dict):
    sqlite_save()
    return {"message": "Workflow saved successfully", "workflow": workflow}



def sqlite_save(name, workflow):
    """
    name: string, name of the workflow
    workflow: dict, the workflow JSON (will be stored as string)
    """
    conn = sqlite3.connect('workflows.db')
    cursor = conn.cursor()
    
    # Convert workflow dict to JSON string
    workflow_json = json.dumps(workflow)
    
    cursor.execute(
        "INSERT INTO workflows (name, workflow) VALUES (?, ?)",
        (name, workflow_json)
    )
    
    conn.commit()
    workflow_id = cursor.lastrowid  # get the auto-increment ID of this workflow
    conn.close()
    
    return workflow_id