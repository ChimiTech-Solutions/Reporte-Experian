import re
from pathlib import Path

files = [
    Path(r'C:\Users\efrai\OneDrive\Escritorio\Reporte Jana\index.html'),
    Path(r'C:\Users\efrai\OneDrive\Escritorio\Reporte Jana\Informe Jana - Actualizado 2024.html'),
]

for fp in files:
    if not fp.exists():
        print(f'Skipping: {fp}')
        continue
    
    html = fp.read_text(encoding='utf-8')
    
    # 1. Eliminar botón flotante si existe
    html = re.sub(r'<button id="export-pdf-btn"[^>]*>.*?</button>\s*', '', html, flags=re.DOTALL)
    
    # 2. Buscar navegación existente
    nav_match = re.search(r'(<div class="navigation"[^>]*>)([\s\S]*?)(</div>)', html)
    
    if nav_match:
        # Ya existe navegación
        nav_start, nav_content, nav_end = nav_match.groups()
        
        # Verificar si ya tiene botón Imprimir
        if 'Imprimir' not in nav_content:
            # Añadir Imprimir antes del cierre
            new_nav = nav_start + nav_content.rstrip() + '\n        <button class="nav-btn" onclick="window.print()">🖨 Imprimir</button>\n        <button class="nav-btn" onclick="prepareAndPrint()">📄 Exportar PDF</button>\n    ' + nav_end
        elif 'Exportar PDF' not in nav_content:
            # Ya tiene Imprimir, solo añadir Exportar PDF después
            new_nav = nav_start + re.sub(
                r'(<button[^>]*window\.print\(\)[^>]*>.*?</button>)',
                r'\1\n        <button class="nav-btn" onclick="prepareAndPrint()">📄 Exportar PDF</button>',
                nav_content,
                flags=re.DOTALL
            ) + nav_end
        else:
            print(f'= {fp.name} already has both buttons')
            continue
        
        html = html.replace(nav_match.group(0), new_nav)
        print(f'+ Updated navigation in {fp.name}')
    else:
        # No hay navegación, crearla antes de </body>
        nav_html = '''
    <div class="navigation">
        <button class="nav-btn" id="prevBtn">◀</button>
        <button class="nav-btn" id="nextBtn">▶</button>
        <button class="nav-btn" onclick="window.print()">🖨 Imprimir</button>
        <button class="nav-btn" onclick="prepareAndPrint()">📄 Exportar PDF</button>
    </div>
'''
        body_end = html.rfind('</body>')
        if body_end != -1:
            html = html[:body_end] + nav_html + html[body_end:]
            print(f'+ Created navigation with both buttons in {fp.name}')
    
    fp.write_text(html, encoding='utf-8')
    print(f'✓ {fp.name} updated')

print('\n✓ Botón "Exportar PDF" añadido junto a "Imprimir" en la navegación')
