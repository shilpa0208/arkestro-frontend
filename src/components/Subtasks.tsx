import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import { StyledHeader, StyledTable } from '../styles/SubtasksStyles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Subtask {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  taskId: String;
}

interface Task {
  id: string;
  name: string;
  description: string;
  projectId: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
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

interface SubtasksApiResponse {
  page: Number,
  totalPages: Number,
  pageSize: Number,
  totalCount: Number,
  data: {
    subtasks: Subtask[],
    tasks: Task[],
    projects: Project[]
  }
}

const createRowData = (response: SubtasksApiResponse) => {
  const res: FlattenedProjectData[] = [];

  const taskById: Map<String, Task> = new Map(response.data.tasks.map(task => [task.id, task]))
  const projectById: Map<String, Project> = new Map(response.data.projects.map(project => [project.id, project]))
  response.data.subtasks.forEach(
    (subtask) => {
      // TODO handle cases where taskId is not in tasks list & task.projectId is not in projects list
      const task = taskById.get(subtask.taskId)!
      const project = projectById.get(task?.projectId)!
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
    }
  )

  return res;
}

const Subtasks: React.FC = () => {
  //data and fetching state
  const [data, setData] = useState<FlattenedProjectData[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  //table state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!data.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }

    try {
      const response = await axios.get(`http://localhost:3001/subtasks?page=${pagination.pageIndex}&perPage=${pagination.pageSize}`,
        {
          withCredentials: true
        });
      const json = (await response.data) as SubtasksApiResponse;

      setData(createRowData(json));
      setRowCount(json.totalCount as number);

    } catch (error: any) {

      if (error.message === 'Request failed with status code 401') {
        navigate('/');
      }
      setIsError(true);
      console.error(error);
      return;
    }
    setIsError(false);
    setIsLoading(false);
    setIsRefetching(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnFilters, //re-fetch when column filters change
    globalFilter, //re-fetch when global filter changes
    pagination.pageIndex, //re-fetch when page index changes
    pagination.pageSize, //re-fetch when page size changes
    sorting, //re-fetch when sorting changes
  ]);

  const handleSaveInfo = async ({ table, values }: { table: any, values: any }) => {
    const body = {
      id: values.projectId,
      name: values.projectName,
      description: values.projectDescription,
      tasks_attributes: {
        id: values.taskId,
        name: values.taskName,
        description: values.taskDescription,
        subtasks_attributes: {
          id: values.subtaskId,
          name: values.subtaskName,
          description: values.subtaskDescription,
          due_date: values.subtaskDueDate
        }
      }
    }

    try {
      await axios.put(`http://localhost:3001/projects/${values.projectId}`,
        body,
        {
          withCredentials: true
        }
      );
      fetchData();
      // await fetch(`http://localhost:3001/projects/${values.projectId}`, {
      //   method: 'PUT',
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(body)
      // });

    } catch (error) {
      console.error('Error during login:', error);
    }

    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<FlattenedProjectData>[]>(
    () => [
      { header: "Project ID", accessorKey: "projectId" },
      { header: "Project Name", accessorKey: "projectName" },
      { header: "Project Description", accessorKey: "projectDescription" },
      { header: "Task ID", accessorKey: "taskId" },
      { header: "Task Name", accessorKey: "taskName" },
      { header: "Task Description", accessorKey: "taskDescription" },
      { header: "Subtask ID", accessorKey: "subtaskId" },
      { header: "Subtask Name", accessorKey: "subtaskName" },
      { header: "Subtask Description", accessorKey: "subtaskDescription" },
      { header: "Subtask Due Date", accessorKey: "subtaskDueDate" },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: false,
    enableDensityToggle: false,
    enableFilters: false,
    enableFullScreenToggle: false,
    enableEditing: true,
    getRowId: (row) => row.subtaskId,
    initialState: { showColumnFilters: false, density: 'compact' },
    manualFiltering: false,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
        color: 'error',
        children: 'Error loading data',
      }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onEditingRowSave: handleSaveInfo,
    rowCount,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return <>
    <StyledHeader>Projects</StyledHeader>
    <StyledTable>
      <MaterialReactTable table={table} />
    </StyledTable>
  </>
};

export default Subtasks;