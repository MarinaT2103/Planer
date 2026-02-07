from PIL import Image, ImageDraw

sizes = {
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192
}

base_path = 'android-app/app/src/main/res'

for density, size in sizes.items():
    # Create square icon
    img = Image.new('RGB', (size, size), color='#FF69B4')  # Pink
    draw = ImageDraw.Draw(img)
    
    # Draw white checkmark/checkbox
    margin = size // 6
    box_size = size - 2 * margin
    
    # White rounded rectangle
    draw.rounded_rectangle(
        [margin, margin, margin + box_size, margin + box_size],
        radius=size//10,
        fill='white'
    )
    
    # Draw checkmark
    check_margin = margin + box_size // 4
    check_x1 = margin + box_size // 3
    check_y1 = margin + box_size // 2
    check_x2 = margin + box_size // 2
    check_y2 = margin + 3 * box_size // 4
    check_x3 = margin + 5 * box_size // 6
    check_y3 = margin + box_size // 3
    
    draw.line([check_x1, check_y1, check_x2, check_y2], fill='#FF69B4', width=max(2, size//24))
    draw.line([check_x2, check_y2, check_x3, check_y3], fill='#FF69B4', width=max(2, size//24))
    
    # Save both launcher and launcher_round
    img.save(f'{base_path}/mipmap-{density}/ic_launcher.png')
    
    # Create round version
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([0, 0, size, size], fill=255)
    
    round_img = Image.new('RGB', (size, size), color='#FF69B4')
    round_draw = ImageDraw.Draw(round_img)
    round_draw.rounded_rectangle(
        [margin, margin, margin + box_size, margin + box_size],
        radius=size//10,
        fill='white'
    )
    round_draw.line([check_x1, check_y1, check_x2, check_y2], fill='#FF69B4', width=max(2, size//24))
    round_draw.line([check_x2, check_y2, check_x3, check_y3], fill='#FF69B4', width=max(2, size//24))
    
    # Apply circular mask
    output = Image.new('RGB', (size, size), color='#FF69B4')
    output.paste(round_img, (0, 0))
    output.putalpha(mask)
    output.save(f'{base_path}/mipmap-{density}/ic_launcher_round.png')

print("Icons created successfully!")
