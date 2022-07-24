const { response } = require('@hapi/hapi/lib/validation');
const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
	const { title, tags, body } = request.payload;
	const id = nanoid(16);
	const createdAt = new Date().toISOString();
	const updatedAt = createdAt;

	notes.push({
		title,
		tags,
		body,
		id,
		createdAt,
		updatedAt,
	});

	const note = notes.find((note) => note.id === id);
	if (note) {
		const response = h.response({
			status: 1,
			message: 'Note successfully added',
			data: note,
		});

		response.code(201);
		return response;
	}

	const response = h.response({
		status: 0,
		message: 'Failed to add note',
	});

	response.code(400);
	return response;
};

const getNotesHandler = (request, h) => ({
	status: 1,
	data: { notes },
});

const getNoteByIdHandler = (request, h) => {
	const { id } = request.params;
	const note = notes.find((note) => note.id === id);

	if (notes) {
		const response = h.response({
			status: 1,
			data: { note },
		});
		response.code(200);

		return response;
	}

	const response = h.response({
		status: 0,
		message: `Note with id ${id} not found`,
	});
	response.code(404);
	return response;
};

const updateNoteHandler = (request, h) => {
	const { id } = request.params;
	const { title, tags, body } = request.payload;
	const updatedAt = new Date().toISOString();

	const noteIndex = notes.findIndex((note) => note.id === id);
	if (noteIndex !== -1) {
		notes[noteIndex] = { ...notes[noteIndex], title, tags, body, updatedAt };

		const response = h.response({
			status: 1,
			message: `Note id: ${id} berhasil diupdate`,
		});

		response.code(200);
		return response;
	}

	const response = h.response({
		status: 0,
		message: `Gagal mengupdate note id: ${id}`,
	});
	response.code(400);
	return response;
};

const deleteNoteHandler = (request, h) => {
	const { id } = request.params;

	const noteIndex = notes.findIndex((note) => note.id === id);
	if (noteIndex !== -1) {
		notes.splice(noteIndex, 1);
		const response = h.response({
			status: 1,
			message: `Note id: ${id} berhasil dihapus`,
		});

		response.code(200);
		return response;
	}

	const response = h.response({
		status: 0,
		message: `Gagal menghapus note id: ${id}`,
	});
	response.code(400);
	return response;
};

module.exports = {
	addNoteHandler,
	getNotesHandler,
	getNoteByIdHandler,
	updateNoteHandler,
	deleteNoteHandler,
};
