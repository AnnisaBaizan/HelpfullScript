function downloadSheetKolomM() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getActiveSheet();
  const sheetId = sheet.getSheetId();

  // Ambil value dari F20:G20 untuk nama file
  const valueF20 = sheet.getRange('F20').getValue();
  const fileName = `Laporan_Monev_Akademik_Tahun_${valueF20}`;

  const url =
    ss.getUrl().replace(/edit$/, '') +
    'export?format=pdf' +
    '&gid=' + sheetId +
    '&range=A:M' +
    '&size=A4' +
    '&portrait=true' +
    '&fitw=true' +
    '&top_margin=0' +
    '&bottom_margin=0' +
    '&left_margin=0' +
    '&right_margin=0' +
    '&sheetnames=false' +
    '&printtitle=false' +
    '&pagenumbers=false' +
    '&gridlines=false' +
    '&fzr=false';

  const token = ScriptApp.getOAuthToken();

  const response = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + token }
  });

  const blob = response.getBlob().setName(fileName + '.pdf');
  const base64 = Utilities.base64Encode(blob.getBytes());

  const html = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
          }
          .status {
            margin: 20px 0;
            color: #0066cc;
          }
          button {
            background-color: #0066cc;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #0052a3;
          }
        </style>
      </head>
      <body>
        <div class="status" id="status">Memproses download...</div>
        <button id="closeBtn" style="display:none;" onclick="google.script.host.close()">
          Tutup
        </button>
        <a id="downloadLink" style="display:none;"></a>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              const link = document.getElementById('downloadLink');
              link.href = 'data:application/pdf;base64,${base64}';
              link.download = '${fileName}.pdf';
              link.click();
              
              document.getElementById('status').textContent = 'Download selesai!';
              document.getElementById('closeBtn').style.display = 'inline-block';
              
              setTimeout(function() {
                google.script.host.close();
              }, 2000);
            }, 100);
          };
        </script>
      </body>
    </html>
  `)
  .setWidth(300)
  .setHeight(150);

  SpreadsheetApp.getUi().showModalDialog(html, 'Download PDF');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('PRINT TOOLS')
    .addItem('Download PDF (Kolom A–M)', 'downloadSheetKolomM')
    .addToUi();
}