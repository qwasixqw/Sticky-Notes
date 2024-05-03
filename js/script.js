'use strict';

const notesContainer = document.getElementById('add');
const addNoteButton = notesContainer.querySelector('.node__add');

addNoteButton.addEventListener('click', () => {
	addNote();
});

getNotes().forEach((note) => {
	const noteElement = createNoteElement(note.id, note.content);

	notesContainer.prepend(noteElement);
});

/**
 * Получает заметки из локального хранилища или возвращает пустой массив, если заметки не найдены.
 *
 * @return {Array} Массив, содержащий полученные заметки.
 */
function getNotes() {
	return JSON.parse(localStorage.getItem('sticky-notes')) || [];
}

/**
 * Сохраняет заданные заметки в локальном хранилище.
 *
 * @param {Array} notes - Массив заметок для сохранения.
 * @return {void} Эта функция ничего не возвращает.
 */
function saveNotes(notes) {
	localStorage.setItem('sticky-notes', JSON.stringify(notes));
}

/**
 * Создает новый элемент textarea для заметки с заданным идентификатором и содержимым.
 *
 * @param {number} id - Идентификатор заметки.
 * @param {string} content - Содержимое заметки.
 * @return {HTMLTextAreaElement} Новый созданный элемент textarea.
 */
function createNoteElement(id, content) {
	const element = document.createElement('textarea');
	element.classList.add('note');
	element.value = content;
	element.placeholder = 'Empty Sticky Note';

	element.addEventListener('change', () => {
		updateNote(id, element.value);
	});

	element.addEventListener('dblclick', () => {
		const doDelete = confirm('Are you sure you want to delete this note?');

		if (doDelete) {
			deleteNote(id, element);
		}
	});

	return element;
}

/**
 * Добавляет новую заметку в список существующих заметок и обновляет локальное хранилище.
 *
 * @return {void} Эта функция не возвращает ничего.
 */
function addNote() {
	const existingNotes = getNotes();

	const noteObject = {
		id: new Date().getTime(),
		content: '',
	};

	const noteElement = createNoteElement(noteObject.id, noteObject.content);

	notesContainer.prepend(noteElement);

	existingNotes.push(noteObject);

	saveNotes(existingNotes);
}

/**
 * Обновляет содержимое заметки с указанным ID.
 *
 * @param {number} id - ID заметки, которую нужно обновить.
 * @param {string} newContent - Новое содержимое для заметки.
 * @return {void} Эта функция ничего не возвращает.
 */
function updateNote(id, newContent) {
	const notes = getNotes();

	const targetNote = notes.filter((note) => note.id == id)[0];

	targetNote.content = newContent;

	saveNotes(notes);
}

/**
 * Удаляет заметку с заданным идентификатором из массива заметок и обновляет заметки в локальном хранилище.
 *
 * @param {number} id - Идентификатор заметки, которую нужно удалить.
 * @param {HTMLElement} element - HTML-элемент, представляющий заметку, которую нужно удалить.
 * @return {void} Эта функция ничего не возвращает.
 */
function deleteNote(id, element) {
	const notes = getNotes().filter((note) => note.id != id);

	saveNotes(notes);

	element.remove();
}
