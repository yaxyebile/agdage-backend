import asyncHandler from '../utils/asyncHandler.js';

// @desc    Upload file
// @route   POST /api/uploads
// @access  Private/Admin
export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  res.json({
    success: true,
    message: 'File uploaded successfully',
    file: {
      url: fileUrl,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    }
  });
});

// @desc    Upload multiple files
// @route   POST /api/uploads/multiple
// @access  Private/Admin
export const uploadMultipleFiles = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  const files = req.files.map(file => ({
    url: `/uploads/${file.filename}`,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  }));

  res.json({
    success: true,
    message: 'Files uploaded successfully',
    files
  });
});