/* global $ Store api */
'use strict';

const renderPage = function (store) {
  if (store.demo) {
    $('.view').css('background-color', 'gray');
    $('#' + store.view).css('background-color', 'white');
  } else {
    $('.view').hide();
    $('#' + store.view).show();
  }
};

const renderList = function (store) {
  const el = $('#' + store.view);
  const listItems = store.list.map((item) => {
    return `<li id="${item.id}">
                <a href="${item.url}" class="detail">${item.title} by ${item.username}</a>
              </li>`;
  });
  el.empty().append('<ul>').find('ul').append(listItems);
};

const renderEdit = function (store) {
  const el = $('#' + store.view);
  const item = store.item;
  const authorList = store.authors.map(a => {
    return `<option value="${a.id}">${a.username}</option>`;
  });
  el.find('[name=title]').val(item.title);
  el.find('[name=author_id]').empty().append('<option>---</option>').append(authorList);
  el.find('[name=author_id]').children(`option[value=${item.author_id}]`).attr('selected', 'selected');
  el.find('[name=content]').val(item.content);
};

const renderDetail = function (store) {  
  const el = $('#' + store.view);
  const item = store.item;
  el.find('.title').text(item.title);
  el.find('.content').text(item.content);
  el.find('.author').text(item.username);
};

const render = function (store) {
  switch (store.view) {
    case 'list': renderList(store);
      break;
    case 'detail': renderDetail(store);
      break;
    case 'edit': renderEdit(store);
      break;
  }

  renderPage(store);
};

const store = new Store();

//on document ready bind events
$(() => {

  $('#create').on('submit', (event) => {
    event.preventDefault();
    const el = $(event.target);
    const document = {
      title: el.find('[name=title]').val(),
      content: el.find('[name=content]').val(),
      author_id: el.find(['name=author_id']).val()
    };
    api.create(document)
      .then(response => {
        store.insert(response);
        store.view = 'detail';
        el.find('[name=title], [name=content], [name=author_id]').val('');
        render(store);
      }).catch(err => {
        console.error(err);
      });
  });

  $('#edit').on('submit', (event) => {
    event.preventDefault();
    const el = $(event.target);
    const document = {
      id: store.item.id,
      title: el.find('[name=title]').val(),
      content: el.find('[name=content]').val(),
      author_id: el.find('[name=author_id]').val()
    };

    api.update(document)
      .then(response => {
        store.findByIdAndUpdate(response);
        store.view = 'detail';
        render(store);
      }).catch(err => {
        console.error(err);
      });
  });

  $('#list').on('click', '.detail', (event) => {
    event.preventDefault();

    const el = $(event.target);
    const id = el.closest('li').attr('id');

    api.details(id)
      .then(response => {
        store.item = response;
        store.view = 'detail';
        render(store);
      }).catch(err => {
        store.error = err;
      });
  });

  $('#detail').on('click', '.remove', (event) => {
    event.preventDefault();
    const id = store.item.id;

    api.remove(id)
      .then(() => {
        store.findByIdAndRemove(id);
        store.view = 'list';
        render(store);
      }).catch(err => {
        console.error(err);
      });
  });

  $('#detail').on('click', '.edit', (event) => {
    event.preventDefault();
    store.authors = null;
    api.getAuthors().then(response => {
      store.authors = response;
      store.view = 'edit';
      render(store);
    });
  });

  $(document).on('click', '.viewCreate', (event) => {
    event.preventDefault();
    store.view = 'create';
    render(store);
  });

  $(document).on('click', '.viewList', (event) => {
    event.preventDefault();

    store.view = 'list';
    render(store);
  });

  // start app by triggering a search
  api.search()
    .then(response => {
      store.list = response;
      store.view = 'list';
      render(store);
    }).catch(err => {
      console.error(err);
    });
});
