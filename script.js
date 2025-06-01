document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#scholarship-table tbody');
  const searchInput = document.getElementById('search');

  Papa.parse('data/scholarships.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data;
      displayTable(data);

      searchInput.addEventListener('input', () => {
        const filtered = data.filter(row =>
          row.Name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
          row.Destination.toLowerCase().includes(searchInput.value.toLowerCase()) ||
          row.Field.toLowerCase().includes(searchInput.value.toLowerCase())
        );
        displayTable(filtered);
      });
    }
  });

  function displayTable(rows) {
    tableBody.innerHTML = '';
    rows.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.Name}</td>
        <td>${row.Destination}</td>
        <td>${row.Deadline}</td>
        <td>${row.Field}</td>
        <td><a href="${row.Link}" target="_blank">Apply</a></td>
      `;
      tableBody.appendChild(tr);
    });
  }
});
