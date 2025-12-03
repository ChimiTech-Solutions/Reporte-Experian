import re
from pathlib import Path

files = [
    Path(r'C:\Users\efrai\OneDrive\Escritorio\Reporte Jana\index.html'),
    Path(r'C:\Users\efrai\OneDrive\Escritorio\Reporte Jana\Informe Jana - Actualizado 2024.html'),
]

style_block = '''\n<style id="pdf-print-styles">\n@media print {\n  @page { size: 1920px 1080px; margin: 0; }\n  html, body { width: 1920px !important; height: auto !important; margin: 0 !important; padding: 0 !important; }\n  .presentation-container { width: 1920px !important; max-width: 1920px !important; }\n  .slide {\n    width: 1920px !important;\n    min-width: 1920px !important;\n    height: 1080px !important;\n    min-height: 1080px !important;\n    page-break-after: always;\n    box-shadow: none !important;\n    margin: 0 auto !important;\n    transform: none !important;\n  }\n  /* Ocultar elementos interactivos / decorativos */\n  .navigation, .nav-btn, .top-actions, #particlesCanvas, .slide-number { display: none !important; }\n  /* Asegurar visibilidad de logos/títulos */\n  .logo-container { position: absolute !important; top: 20px !important; left: 20px !important; }\n}\n\n/* Botón de exportación en pantalla */\n.export-pdf-btn {\n  position: fixed;\n  bottom: 18px;\n  right: 18px;\n  z-index: 100000;\n  background: linear-gradient(135deg, #F26398, #C084FC);\n  color: #fff;\n  border: none;\n  border-radius: 28px;\n  padding: 10px 14px;\n  font-size: 14px;\n  box-shadow: 0 6px 18px rgba(0,0,0,0.25);\n  cursor: pointer;\n}
.export-pdf-btn:hover { filter: brightness(1.05); }
@media print { .export-pdf-btn { display: none !important; } }
</style>\n'''

script_block = '''\n<script id="pdf-print-script">\n(function(){\n  function replaceCanvasesForPrint(){\n    const canvases = Array.from(document.querySelectorAll('canvas'));\n    canvases.forEach((cv) => {\n      if (cv.dataset.printReplaced === '1') return;\n      try {\n        const img = new Image();\n        // Use toDataURL for best available bitmap; many charts render at devicePixelRatio already\n        img.src = cv.toDataURL('image/png');\n        img.className = 'canvas-print-image';\n        img.style.width = (cv.style.width || cv.width + 'px');\n        img.style.height = (cv.style.height || cv.height + 'px');\n        cv.style.display = 'none';\n        cv.parentNode.insertBefore(img, cv.nextSibling);\n        cv.dataset.printReplaced = '1';\n      } catch(e) { /* ignore */ }\n    });\n  }\n  function restoreCanvasesAfterPrint(){\n    const imgs = Array.from(document.querySelectorAll('img.canvas-print-image'));\n    imgs.forEach((img) => {\n      const prev = img.previousElementSibling;\n      if (prev && prev.tagName === 'CANVAS') { prev.style.display = ''; prev.dataset.printReplaced = '0'; }\n      img.remove();\n    });\n  }\n  function prepareAndPrint(){\n    replaceCanvasesForPrint();\n    // Pequeña espera para asegurar el DOM\n    setTimeout(() => { window.print(); }, 200);\n  }\n  // Exponer global para el botón
  window.prepareAndPrint = prepareAndPrint;\n  // Manejar eventos del navegador
  if (window.matchMedia) {\n    const mql = window.matchMedia('print');\n    mql.addEventListener ? mql.addEventListener('change', (e)=>{ if(!e.matches) restoreCanvasesAfterPrint(); }) : mql.addListener && mql.addListener((e)=>{ if(!e.matches) restoreCanvasesAfterPrint(); });\n  }\n  window.addEventListener('afterprint', restoreCanvasesAfterPrint);\n})();\n</script>\n'''

button_block = '''\n<button id="export-pdf-btn" class="export-pdf-btn" onclick="prepareAndPrint()" title="Exportar a PDF">Exportar PDF</button>\n'''

for fp in files:
    if not fp.exists():
        print(f'Skipping missing file: {fp}')
        continue
    html = fp.read_text(encoding='utf-8', errors='ignore')

    # Insert style in <head>
    if 'id="pdf-print-styles"' not in html:
        html = html.replace('<head>', '<head>' + style_block)
        print(f'+ Styles injected into {fp.name}')
    else:
        print(f'= Styles already present in {fp.name}')

    # Insert script before </body>
    if 'id="pdf-print-script"' not in html:
        idx = html.rfind('</body>')
        if idx != -1:
            html = html[:idx] + script_block + html[idx:]
            print(f'+ Script injected into {fp.name}')
    else:
        print(f'= Script already present in {fp.name}')

    # Insert button near end of body (above nav if exists)
    if 'id="export-pdf-btn"' not in html:
        nav_idx = html.rfind('<div class="navigation"')
        if nav_idx != -1:
            html = html[:nav_idx] + button_block + html[nav_idx:]
        else:
            idx = html.rfind('</body>')
            if idx != -1:
                html = html[:idx] + button_block + html[idx:]
        print(f'+ Button injected into {fp.name}')
    else:
        print(f'= Button already present in {fp.name}')

    fp.write_text(html, encoding='utf-8')
    print(f'✓ Updated {fp.name}')
