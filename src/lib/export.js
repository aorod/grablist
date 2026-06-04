export function downloadAsXls(items, listName = 'GrabList') {
  const safeName = listName.replace(/[\\/:*?"<>|]/g, '_').trim() || 'GrabList'
  const header = ['Produto', 'Categoria', 'Quantidade', 'Preço Unitário (R$)', 'Total (R$)']
  const rows = items.map(item => [
    item.product,
    item.categoryName,
    item.qty,
    (item.unitPrice || 0).toFixed(2).replace('.', ','),
    ((item.qty || 0) * (item.unitPrice || 0)).toFixed(2).replace('.', ','),
  ])

  const grandTotal = items
    .reduce((sum, i) => sum + (i.qty || 0) * (i.unitPrice || 0), 0)
    .toFixed(2)
    .replace('.', ',')

  const tableRows = rows
    .map(r => `<tr>${r.map(cell => `<td>${cell}</td>`).join('')}</tr>`)
    .join('')

  const totalRow = `<tr>
    <td><b>TOTAL</b></td>
    <td></td>
    <td></td>
    <td></td>
    <td><b>${grandTotal}</b></td>
  </tr>`

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:x="urn:schemas-microsoft-com:office:excel"
        xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"></head>
<body>
<table>
  <thead><tr>${header.map(h => `<th><b>${h}</b></th>`).join('')}</tr></thead>
  <tbody>${tableRows}${totalRow}</tbody>
</table>
</body></html>`

  const blob = new Blob(['﻿' + html], {
    type: 'application/vnd.ms-excel;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${safeName}.xls`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
