// Serialize dates for API requests
export function serializeDates(data: any): any {
  const serialized = { ...data }
  
  if (serialized.createdAt instanceof Date) {
    serialized.createdAt = serialized.createdAt.toISOString()
  }
  if (serialized.updatedAt instanceof Date) {
    serialized.updatedAt = serialized.updatedAt.toISOString()
  }
  if (serialized.dueDate instanceof Date) {
    serialized.dueDate = serialized.dueDate.toISOString()
  }
  
  return serialized
}

// Deserialize dates from API responses
export function deserializeDates(data: any): any {
  if (!data) return data
  
  const deserialized = { ...data }
  
  if (deserialized.createdAt) {
    deserialized.createdAt = new Date(deserialized.createdAt)
  }
  if (deserialized.updatedAt) {
    deserialized.updatedAt = new Date(deserialized.updatedAt)
  }
  if (deserialized.dueDate) {
    deserialized.dueDate = new Date(deserialized.dueDate)
  }
  
  return deserialized
}

