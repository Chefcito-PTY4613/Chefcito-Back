import multer from 'multer';

// Configure Multer to handle file uploads
const storage = multer.memoryStorage();


export const uploadFile = multer({ storage });