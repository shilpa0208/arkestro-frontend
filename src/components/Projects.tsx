import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { StyledHeader, StyledTable } from '../styles/ProjectsStyles';
import { useNavigate } from 'react-router-dom';

interface Subtask {
    id: string;
    name: string;
    description: string;
    dueDate: string;
}

interface Task {
    id: string;
    name: string;
    description: string;
    subtasks: Subtask[];
}

interface Project {
    id: string;
    name: string;
    description: string;
    tasks: Task[]
}

interface FlattenedProjectData {
    projectId: string;
    projectName: string;
    projectDescription: string;
    taskId: string;
    taskName: string;
    taskDescription: string;
    subtaskId: string;
    subtaskName: string;
    subtaskDescription: string;
    subtaskDueDate: string;
}

const Projects: React.FC = () => {
    const [rowData, setRowData] = useState<any>([{}]);
    const navigate = useNavigate();

    const fetchData = async () => {
        const data = await axios.get('http://localhost:3001/projects',
            { withCredentials: true }
        );

        if (data.data && data.data.length) {
            setRowData(createRowData(data.data));
        }
    }

    useEffect(() => {
        fetchData()
            .catch((error: any) => {
                if (error.message === 'Request failed with status code 401') {
                    navigate('/');
                }
                console.error(error);
            })
    }, []);

    // Column Definitions: Defines & controls grid columns
    const colDefs: ColDef[] = [
        { headerName: "Project ID", field: "projectId" },
        { headerName: "Project Name", field: "projectName" },
        { headerName: "Project Description", field: "projectDescription" },
        { headerName: "Task ID", field: "taskId" },
        { headerName: "Task Name", field: "taskName" },
        { headerName: "Task Description", field: "taskDescription" },
        { headerName: "Subtask ID", field: "subtaskId" },
        { headerName: "Subtask Name", field: "subtaskName" },
        { headerName: "Subtask Description", field: "subtaskDescription" },
        { headerName: "Subtask Due Date", field: "subtaskDueDate" },
    ];

    const defaultColDef = {
        editable: true,
        resizable: true,
    };

    const createRowData = (projectsData: Project[]) => {
        const res: FlattenedProjectData[] = [];

        projectsData.forEach((project: Project) => {
            project?.tasks.forEach((task: Task) => {
                task?.subtasks.forEach((subtask) => {
                    res.push({
                        projectId: project.id,
                        projectName: project.name,
                        projectDescription: project.description,
                        taskId: task?.id,
                        taskName: task?.name,
                        taskDescription: task?.description,
                        subtaskId: subtask?.id,
                        subtaskName: subtask?.name,
                        subtaskDescription: subtask?.description,
                        subtaskDueDate: subtask?.dueDate,
                    })
                })
            })
        });

        return res;
    }

    const handleCellValueChanged = async (event: any) => {
        const { data } = event;

        const body = {
            id: data.projectId,
            name: data.projectName,
            description: data.description,
            tasks_attributes: {
                id: data.taskId,
                name: data.taskName,
                description: data.description,
                subtasks_attributes: {
                    id: data.subtaskId,
                    name: data.subtaskName,
                    description: data.subtaskDescription,
                    due_date: data.subtaskDueDate
                }
            }
        }

        try {
            const response = await axios.put(`http://localhost:3001/projects/${data.projectId}`, body);
            console.log(response)

            if (response.status === 200) {
                // Refetch updated data
                fetchData();
            } else {
                // TODO: Handle login failure in a better way
                console.error('Failed to update data');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <>
            <StyledHeader>Projects</StyledHeader>
            <StyledTable className="ag-theme-quartz" style={{ width: '100%', height: '100vh' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    onCellValueChanged={handleCellValueChanged}
                    pagination={true}
                    paginationPageSize={50}
                />
            </StyledTable>
        </>
    )
}


export default Projects;
