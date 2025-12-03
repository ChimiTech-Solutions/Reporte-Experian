import re

html_file = r'C:\Users\efrai\OneDrive\Escritorio\Reporte Jana\index.html'

with open(html_file, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Eliminar CSS del botón flotante
html = re.sub(
    r'/\* Botón de exportación en pantalla \*/\s*\.export-pdf-btn\s*\{[^}]+\}\s*\.export-pdf-btn:hover\s*\{[^}]+\}\s*@media print \{ \.export-pdf-btn \{ display: none !important; \} \}',
    '',
    html,
    flags=re.DOTALL
)

# 2. Eliminar el botón flotante HTML (el que tiene id="export-pdf-btn")
html = re.sub(
    r'<button id="export-pdf-btn" class="export-pdf-btn"[^>]*>.*?</button>\s*',
    '',
    html,
    flags=re.DOTALL
)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html)

print('✓ Botón flotante eliminado')
print('✓ Solo queda el botón en la navegación')

# Verificar que existe el botón en navegación
if 'class="navigation"' in html and 'prepareAndPrint()' in html:
    print('✓ Botón en navegación confirmado')
else:
    print('⚠ No se encontró navegación con el botón')
