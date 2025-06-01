document.addEventListener('DOMContentLoaded', function () {
  const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_xfwx-m2FUzkkhVYUA8TOjAi8VyssrSwX4dcUZaGTXUId7xyamUtXtwgENc8DbFpKe80HajpXSxys/pub?gid=740837788&single=true&output=csv';

  const tableBody = document.querySelector('#scholarship-table tbody');
  const fieldFilter = document.getElementById('field-filter');
  const langToggle = document.getElementById('toggle-lang');
  const darkToggle = document.getElementById('toggle-dark');

  let scholarships = [];
  let currentLanguage = 'en';

  Papa.parse(sheetURL, {
    download: true,
    header: true,
    complete: function (results) {
      scholarships = results.data.filter(row => row.Name && row.Name.trim() !== '');
      populateTable(scholarships);
      populateFields(scholarships);
    }
  });

  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  langToggle.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    updateLanguage();
    populateTable(scholarships);
  });

  fieldFilter.addEventListener('change', () => {
    populateTable(scholarships);
  });

  function populateTable(data) {
    const selectedField = fieldFilter.value;
    tableBody.innerHTML = '';

    const filtered = selectedField === 'All' ? data : data.filter(s => s.Field === selectedField);

    filtered.forEach(s => {
      const row = document.createElement('tr');

      row.innerHTML = `
  <td data-label="Name">${currentLanguage === 'en' ? s.Name : s.Name_AR || s.Name}</td>
  <td data-label="Country">${currentLanguage === 'en' ? s.Country : s.Country_AR || s.Country}</td>
  <td data-label="Deadline">${s.Deadline || 'N/A'}</td>
  <td data-label="Field">${currentLanguage === 'en' ? s.Field : s.Field_AR || s.Field}</td>
  <td data-label="Link"><a href="${s.Link}" target="_blank">🔗</a></td>
  `;
      tableBody.appendChild(row);
    });
  }

  function populateFields(data) {
    const fields = Array.from(new Set(data.map(s => s.Field))).filter(f => f && f.trim() !== '');
    fieldFilter.innerHTML = '<option value="All">All Fields</option>';

    fields.forEach(field => {
      const option = document.createElement('option');
      option.value = field;
      option.textContent = field;
      fieldFilter.appendChild(option);
    });
  }

  function updateLanguage() {
    langToggle.textContent = currentLanguage === 'en' ? '🇺🇸 عربي' : '🇸🇦 English';
    fieldFilter.options[0].textContent = currentLanguage === 'en' ? 'All Fields' : 'كل التخصصات';
  }
});

