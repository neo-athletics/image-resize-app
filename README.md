# Resize It - Image Processing Application

A modern full-stack application built with React and Express that provides powerful image processing capabilities. The application allows users to upload images, resize them, and convert them to different formats while maintaining optimal quality settings for each format.

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, DaisyUI
- **Backend**: Node.js, Express, Sharp
- **File Handling**: Multer
- **Image Processing**: Sharp library

## Features

- Image upload support
- Multiple format conversion (JPEG, PNG, WebP, AVIF, TIFF, GIF, HEIF)
- Image resizing with aspect ratio maintenance
- Format-specific optimization settings
- Caching system for improved performance
- Real-time image preview
- Error handling and validation
- Progressive image loading

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd image-processor-app
```

2. Install dependencies:

```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

## Development

### Start the Server

```bash
cd server
npm run dev  # Runs with nodemon for development
```

Server runs on `http://localhost:4000`

### Start the Client

```bash
cd client
npm run dev  # Runs Vite dev server
```

Client runs on `http://localhost:5173`

## API Documentation

### 1. GET `/api/images`

Process existing images in the public directory.

**Query Parameters:**

- `filename` (required): Name of the image file
- `width` (optional): Desired width in pixels
- `height` (optional): Desired height in pixels
- `format` (optional): Output format

**Example:**

```
GET /api/images?filename=example&width=800&height=600&format=webp
```

### 2. POST `/upload`

Upload and process new images.

**Request Body (multipart/form-data):**

- `image` (required): Image file
- `width` (optional): Desired width in pixels
- `height` (optional): Desired height in pixels
- `format` (optional): Output format (defaults to jpeg)

**Supported Formats:**

- JPEG (`jpeg`): Quality 85, Progressive loading, MozJPEG optimization
- PNG (`png`): Compression level 6, Adaptive filtering
- WebP (`webp`): Quality 85, Effort level 4
- AVIF (`avif`): Quality 50, Effort level 4
- TIFF (`tiff`): Quality 85, LZW compression
- GIF (`gif`): Standard settings
- HEIF (`heif`): Quality 85

## Project Structure

```
image-processor-app/
├── client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── ImageProcessingForm.tsx
│   │   └── ...
│   ├── public/
│   │   └── images/
│   └── package.json
├── server/
│   ├── index.ts
│   ├── processImage.ts
│   ├── cache/
│   ├── uploads/
│   └── package.json
└── README.md
```

## Caching System

The application implements a caching system for processed images:

- Processed images are stored in `server/cache/`
- Cache naming format: `{filename}_{width}x{height}.{format}`
- Cached images are served on subsequent requests with identical parameters
- Manual cache clearing may be required periodically

## Error Handling

The application includes comprehensive error handling for:

- Invalid file types
- Processing failures
- File size limits
- Format conversion errors
- Invalid dimensions
- Missing files

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License

## Development Notes

- The server includes CORS support for development
- Image processing is handled asynchronously
- File cleanup is automated for temporary uploads
- Security measures include filename sanitization
- Default format is JPEG if none specified
