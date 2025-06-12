document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#scholarship-table tbody');
  const searchInput = document.getElementById('search');
  const sortBtn = document.getElementById('sort-deadline');
  const fieldFilter = document.getElementById('field-filter');
   // 🌐 Language Toggle
   const toggleBtn = document.getElementById('toggle-language');
   let isArabic = false;
 
   function updateLanguageDirection() {
     document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
     document.documentElement.lang = isArabic ? 'ar' : 'en';
     
     // Update table alignment
     const tableElements = document.querySelectorAll('th, td');
     tableElements.forEach(el => {
       el.style.textAlign = isArabic ? 'right' : 'left';
     });
   }
 
   toggleBtn.addEventListener('click', () => {
     isArabic = !isArabic;
     updateLanguageDirection();
 
     document.getElementById('header-name').textContent = isArabic ? 'الاسم' : 'Name';
     document.getElementById('header-destination').textContent = isArabic ? 'الوجهة' : 'Destination';
     document.getElementById('header-deadline').textContent = isArabic ? 'الموعد النهائي' : 'Deadline';
     document.getElementById('header-field').textContent = isArabic ? 'المجال' : 'Field';
     document.getElementById('header-link').textContent = isArabic ? 'رابط التقديم' : 'Link';
 
     document.querySelector('label[for="field-filter"]').textContent = isArabic ? 'تصفية حسب المجال:' : 'Filter by Field:';
     searchInput.placeholder = isArabic ? 'ابحث عن منحة...' : 'Search scholarships...';
     toggleBtn.textContent = isArabic ? '🌐 English' : '🌐 العربية';
 
     sortBtn.textContent = isArabic
       ? (currentSortOrder === 'asc' ? 'ترتيب حسب الموعد النهائي ↑' : 'ترتيب حسب الموعد النهائي ↓')
       : (currentSortOrder === 'asc' ? 'Sort by Deadline ↑' : 'Sort by Deadline ↓');
 
     // Update Apply button text
     const applyButtons = document.querySelectorAll('td[data-label="Link"] a');
     applyButtons.forEach(btn => {
       btn.textContent = isArabic ? 'تقديم' : 'Apply';
     });
   });

  let currentSortOrder = 'asc';
  let allData = [];

  Papa.parse('https://docs.google.com/spreadsheets/d/1KQA6aS0__43iwuRIruqH2GA_pToSagLzDgwPLTdodmI/edit?usp=sharing', {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      allData = results.data.map(row => ({
        Name: row["Name"]?.trim() || "N/A",
        Destination: row["Destination"]?.trim() || "N/A",
        Deadline: row["Deadline"]?.trim() || "N/A",
        Field: row["Field"]?.trim() || "N/A",
        Link: row["Link"]?.trim() || "#"
      }));

      populateFieldFilter(allData);
      displayTable(allData);
    }
  });

  // Populate dropdown with unique fields
  function populateFieldFilter(data) {
    const fields = [...new Set(data.map(row => row.Field))].sort();
    fields.forEach(field => {
      const option = document.createElement('option');
      option.value = field;
      option.textContent = field;
      fieldFilter.appendChild(option);
    });
  }

  // Display table rows
  function displayTable(rows) {
    tableBody.innerHTML = '';
    rows.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td data-label="Name">${row.Name}</td>
        <td data-label="Destination">${row.Destination}</td>
        <td data-label="Deadline">${row.Deadline}</td>
        <td data-label="Field">${row.Field}</td>
        <td data-label="Link"><a href="${row.Link}" target="_blank">Apply</a></td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Filter & search
  function filterAndDisplay() {
    const searchQuery = searchInput.value.toLowerCase();
    const selectedField = fieldFilter.value;

    let filtered = allData.filter(row =>
      row.Name.toLowerCase().includes(searchQuery) ||
      row.Destination.toLowerCase().includes(searchQuery) ||
      row.Field.toLowerCase().includes(searchQuery)
    );

    if (selectedField) {
      filtered = filtered.filter(row => row.Field === selectedField);
    }

    displayTable(filtered);
  }

  // Event listeners
  searchInput.addEventListener('input', filterAndDisplay);
  fieldFilter.addEventListener('change', filterAndDisplay);

  sortBtn.addEventListener('click', () => {
    if (currentSortOrder === 'asc') {
      allData.sort((a, b) => new Date(a.Deadline) - new Date(b.Deadline));
      sortBtn.textContent = 'Sort by Deadline ↓';
      currentSortOrder = 'desc';
    } else {
      allData.sort((a, b) => new Date(b.Deadline) - new Date(a.Deadline));
      sortBtn.textContent = 'Sort by Deadline ↑';
      currentSortOrder = 'asc';
    }
    filterAndDisplay();
  });
});
