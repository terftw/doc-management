import express from 'express';
import { DocumentController } from './documents.controller';

const router = express.Router();
const documentController = new DocumentController();

// GET /api/documents
router.get('/', (req, res) => documentController.getDocuments(req, res));

// GET /api/documents/:id
router.get('/:id', (req, res) => documentController.getDocumentById(req, res));

// POST /api/documents
router.post('/', (req, res) => documentController.createDocument(req, res));

// DELETE /api/documents/:id
router.delete('/:id', (req, res) => documentController.deleteDocument(req, res));

export default router;
