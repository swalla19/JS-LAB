$(function () {
  const storageKey = 'experiment12Tasks';
  const $taskForm = $('#taskForm');
  const $taskInput = $('#taskInput');
  const $taskList = $('#taskList');
  const $status = $('#status');
  const $loadSamplesButton = $('#loadSamplesButton');
  let activeFilter = 'all';
  let tasks = loadTasks();

  function loadTasks() {
    try {
      const storedTasks = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (!Array.isArray(storedTasks)) throw new Error('Stored task data is invalid.');
      return storedTasks.filter((task) =>
        task && typeof task.id === 'string' &&
        typeof task.title === 'string' && typeof task.completed === 'boolean'
      );
    } catch (error) {
      showStatus(`Could not read saved tasks: ${error.message}`, true);
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
      return true;
    } catch (error) {
      showStatus(`Could not save tasks in this browser: ${error.message}`, true);
      return false;
    }
  }

  function showStatus(message, isError) {
    $status.text(message).toggleClass('error', Boolean(isError));
  }

  function visibleTasks() {
    if (activeFilter === 'active') return tasks.filter((task) => !task.completed);
    if (activeFilter === 'completed') return tasks.filter((task) => task.completed);
    return tasks;
  }

  function renderTasks() {
    $taskList.empty();
    const filteredTasks = visibleTasks();

    if (filteredTasks.length === 0) {
      const emptyMessage = tasks.length === 0
        ? 'No tasks yet. Add one above or load sample tasks.'
        : 'No tasks match this filter.';
      $('<li>').addClass('empty-state').text(emptyMessage).appendTo($taskList);
      return;
    }

    filteredTasks.forEach((task) => {
      const $item = $('<li>').addClass('task-item').toggleClass('completed', task.completed);
      const $checkbox = $('<input>', {
        type: 'checkbox',
        class: 'task-toggle',
        'aria-label': `Mark "${task.title}" as ${task.completed ? 'active' : 'completed'}`
      }).prop('checked', task.completed).attr('data-task-id', task.id);
      const $title = $('<span>').addClass('task-title').text(task.title);
      const $delete = $('<button>', {
        type: 'button',
        class: 'delete-button',
        text: 'Delete',
        'aria-label': `Delete "${task.title}"`
      }).attr('data-task-id', task.id);

      $item.append($checkbox, $title, $delete).appendTo($taskList);
    });
  }

  function createTask(title, completed) {
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title,
      completed: Boolean(completed)
    };
  }

  $taskForm.on('submit', function (event) {
    event.preventDefault();
    const title = $taskInput.val().trim();
    if (!title) {
      showStatus('Enter a task before adding it.', true);
      $taskInput.trigger('focus');
      return;
    }

    tasks.unshift(createTask(title, false));
    const saved = saveTasks();
    renderTasks();
    $taskInput.val('').trigger('focus');
    if (saved) showStatus('Task added.');
  });

  $taskList.on('change', '.task-toggle', function () {
    const task = tasks.find((item) => item.id === $(this).attr('data-task-id'));
    if (!task) return;

    task.completed = $(this).prop('checked');
    renderTasks();
    if (saveTasks()) {
      showStatus(task.completed ? 'Task completed.' : 'Task marked active.');
    }
  });

  $taskList.on('click', '.delete-button', function () {
    const taskId = $(this).attr('data-task-id');
    tasks = tasks.filter((task) => task.id !== taskId);
    renderTasks();
    if (saveTasks()) showStatus('Task deleted.');
  });

  $('.filter-button').on('click', function () {
    activeFilter = $(this).attr('data-filter');
    $('.filter-button').removeClass('active').attr('aria-pressed', 'false');
    $(this).addClass('active').attr('aria-pressed', 'true');
    renderTasks();
  });

  $loadSamplesButton.on('click', function () {
    if (!window.jQuery) {
      showStatus('jQuery did not load. Check your internet connection and reload the page.', true);
      return;
    }

    $loadSamplesButton.prop('disabled', true).text('Loading samples…');
    showStatus('Requesting sample tasks from the API…');

    $.ajax({
      url: 'https://jsonplaceholder.typicode.com/todos',
      method: 'GET',
      data: { _limit: 5 },
      dataType: 'json',
      timeout: 10000
    })
      .done((data) => {
        if (!Array.isArray(data)) {
          showStatus('The API returned data in an unexpected format.', true);
          return;
        }

        const samples = data
          .filter((item) => item && typeof item.title === 'string')
          .map((item) => createTask(item.title, item.completed));
        if (samples.length === 0) {
          showStatus('The API did not return any usable sample tasks.', true);
          return;
        }

        tasks = [...samples, ...tasks];
        activeFilter = 'all';
        $('.filter-button').removeClass('active').attr('aria-pressed', 'false');
        $('.filter-button[data-filter="all"]').addClass('active').attr('aria-pressed', 'true');
        renderTasks();
        if (saveTasks()) {
          showStatus(`Loaded ${samples.length} sample tasks and saved them in this browser.`);
        }
      })
      .fail((_, textStatus, errorThrown) => {
        const reason = textStatus === 'timeout' ? 'The request timed out.' : (errorThrown || textStatus);
        showStatus(`Could not load sample tasks: ${reason}. Check your connection and try again.`, true);
      })
      .always(() => {
        $loadSamplesButton.prop('disabled', false).text('Load sample tasks');
      });
  });

  renderTasks();
});
