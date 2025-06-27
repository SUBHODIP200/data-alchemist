export type ValidationError = {
    rowIndex: number;
    column: string;
    message: string;
  };
  
  export function validateClients(data: any[]): ValidationError[] {
    const errors: ValidationError[] = [];
  
    data.forEach((row, rowIndex) => {
      if (!row.ClientID) errors.push({ rowIndex, column: 'ClientID', message: 'Missing ClientID' });
      if (!row.ClientName) errors.push({ rowIndex, column: 'ClientName', message: 'Missing ClientName' });
  
      const level = parseInt(row.PriorityLevel);
      if (isNaN(level) || level < 1 || level > 5) {
        errors.push({ rowIndex, column: 'PriorityLevel', message: 'PriorityLevel must be 1–5' });
      }
  
      if (row.AttributesJSON) {
        try {
          JSON.parse(row.AttributesJSON);
        } catch {
          errors.push({ rowIndex, column: 'AttributesJSON', message: 'Invalid JSON' });
        }
      }
    });
  
    return errors;
  }
  
  export function validateWorkers(data: any[]): ValidationError[] {
    const errors: ValidationError[] = [];
  
    data.forEach((row, rowIndex) => {
      if (!row.WorkerID) errors.push({ rowIndex, column: 'WorkerID', message: 'Missing WorkerID' });
      if (!row.WorkerName) errors.push({ rowIndex, column: 'WorkerName', message: 'Missing WorkerName' });
  
      if (!row.AvailableSlots || !row.AvailableSlots.includes('[')) {
        errors.push({ rowIndex, column: 'AvailableSlots', message: 'Should be a JSON array like [1,2]' });
      }
  
      const load = parseInt(row.MaxLoadPerPhase);
      if (isNaN(load) || load < 1) {
        errors.push({ rowIndex, column: 'MaxLoadPerPhase', message: 'MaxLoadPerPhase must be ≥ 1' });
      }
    });
  
    return errors;
  }
  
  export function validateTasks(data: any[]): ValidationError[] {
    const errors: ValidationError[] = [];
  
    data.forEach((row, rowIndex) => {
      if (!row.TaskID) errors.push({ rowIndex, column: 'TaskID', message: 'Missing TaskID' });
      if (!row.TaskName) errors.push({ rowIndex, column: 'TaskName', message: 'Missing TaskName' });
  
      const dur = parseInt(row.Duration);
      if (isNaN(dur) || dur < 1) {
        errors.push({ rowIndex, column: 'Duration', message: 'Duration must be ≥ 1' });
      }
  
      if (!row.PreferredPhases || row.PreferredPhases.length < 1) {
        errors.push({ rowIndex, column: 'PreferredPhases', message: 'Missing PreferredPhases' });
      }
  
      const mc = parseInt(row.MaxConcurrent);
      if (isNaN(mc) || mc < 1) {
        errors.push({ rowIndex, column: 'MaxConcurrent', message: 'Must be ≥ 1' });
      }
    });
  
    return errors;
  }
  