'use client';

import { useState } from 'react';
import { parseCSVFile, parseExcelFile } from '@/lib/parser';
import { getFilterFunction } from '@/lib/filter';
import FileUploader from '@/components/FileUploader';
import DataGrid from '@/components/DataGrid';
import RuleBuilder from '@/components/RuleBuilder/RuleBuilder';

export default function HomePage() {
  const [clients, setClients] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<any[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);

  const [clientQuery, setClientQuery] = useState('');
  const [workerQuery, setWorkerQuery] = useState('');
  const [taskQuery, setTaskQuery] = useState('');

  const handleFileUpload = async (file: File, type: 'clients' | 'workers' | 'tasks') => {
    const isCSV = file.name.endsWith('.csv');
    const parsedData = isCSV
      ? await parseCSVFile(file, type)
      : await parseExcelFile(file, type);

    if (type === 'clients') {
      setClients(parsedData);
      setFilteredClients([]);
    }
    if (type === 'workers') {
      setWorkers(parsedData);
      setFilteredWorkers([]);
    }
    if (type === 'tasks') {
      setTasks(parsedData);
      setFilteredTasks([]);
    }
  };

  const runFilter = async (
    query: string,
    data: any[],
    type: 'clients' | 'workers' | 'tasks'
  ) => {
    if (!query || data.length === 0) return;

    const fn = await getFilterFunction(query, type, data[0]);
    const result = data.filter(fn);

    if (type === 'clients') setFilteredClients(result);
    if (type === 'workers') setFilteredWorkers(result);
    if (type === 'tasks') setFilteredTasks(result);
  };

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">🧪 Data Alchemist</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FileUploader label="Upload Clients File" onUpload={(f) => handleFileUpload(f, 'clients')} />
        <FileUploader label="Upload Workers File" onUpload={(f) => handleFileUpload(f, 'workers')} />
        <FileUploader label="Upload Tasks File" onUpload={(f) => handleFileUpload(f, 'tasks')} />
      </div>

      {clients.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2 mt-6">Clients</h2>
          <input
            type="text"
            placeholder='e.g. "PriorityLevel > 2 and RequestedTaskIDs includes T1"'
            className="border p-2 w-full mb-2 text-sm"
            value={clientQuery}
            onChange={(e) => setClientQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && runFilter(clientQuery, clients, 'clients')
            }
          />
          <DataGrid
            data={filteredClients.length ? filteredClients : clients}
            setData={setClients}
            entityType="clients"
          />
        </section>
      )}

      {workers.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2 mt-6">Workers</h2>
          <input
            type="text"
            placeholder='e.g. "MaxLoadPerPhase < 3"'
            className="border p-2 w-full mb-2 text-sm"
            value={workerQuery}
            onChange={(e) => setWorkerQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && runFilter(workerQuery, workers, 'workers')
            }
          />
          <DataGrid
            data={filteredWorkers.length ? filteredWorkers : workers}
            setData={setWorkers}
            entityType="workers"
          />
        </section>
      )}

      {tasks.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2 mt-6">Tasks</h2>
          <input
            type="text"
            placeholder='e.g. "Duration > 1 and PreferredPhases includes 2"'
            className="border p-2 w-full mb-2 text-sm"
            value={taskQuery}
            onChange={(e) => setTaskQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && runFilter(taskQuery, tasks, 'tasks')
            }
          />
          <DataGrid
            data={filteredTasks.length ? filteredTasks : tasks}
            setData={setTasks}
            entityType="tasks"
          />
        </section>
      )}
      <RuleBuilder/>
    </main>
  );
}
