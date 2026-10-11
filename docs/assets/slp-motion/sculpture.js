import * as THREE from './vendor/three.module.js';
import './vendor/polygon-clipping.js';

// Thin articulated glass sheets carry the tiger strips, then lift into the SLP assembly.
// Artwork and lettering belong to the physical sheets; there is no screen-space image layer.
export async function buildSculpture(font) {
  const image = new Image();
  image.src = new URL('./assets/tiger-reference.png', import.meta.url).href;
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const { width: iw, height: ih, data } = pixels;
  // Only exterior paper is removed. Enclosed white eyes, muzzle and mouth survive.
  const exterior = new Uint8Array(iw * ih);
  const queue = new Int32Array(iw * ih); let head = 0, tail = 0;
  const isPaper = index => data[index*4] > 239 && data[index*4+1] > 239 && data[index*4+2] > 239;
  function enqueue(index) { if (!exterior[index] && isPaper(index)) { exterior[index] = 1; queue[tail++] = index; } }
  for (let x = 0; x < iw; x++) { enqueue(x); enqueue((ih-1)*iw+x); }
  for (let y = 0; y < ih; y++) { enqueue(y*iw); enqueue(y*iw+iw-1); }
  while (head < tail) {
    const index = queue[head++], x = index % iw, y = Math.floor(index/iw);
    if (x) enqueue(index-1); if (x<iw-1) enqueue(index+1);
    if (y) enqueue(index-iw); if (y<ih-1) enqueue(index+iw);
  }
  for (let i = 0; i < exterior.length; i++) if (exterior[i]) data[i*4+3] = 0;
  context.putImageData(pixels, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.minFilter = THREE.LinearMipmapLinearFilter;

  const outlines = font.generateShapes('SLP', 4.8).map(shape => shape.extractPoints(28));
  const xs = outlines.flatMap(outline => outline.shape.map(point => point.x));
  const left = Math.min(...xs), right = Math.max(...xs), center = (left+right)/2;
  const width = right-left, depth = width * ih/iw;
  const polygons = outlines.map(outline => [outline.shape,...outline.holes].map(ring => ring.map(point => [point.x-center,point.y])));
  // Color belongs to the letter, including its first and last clipped pane.
  const letters = polygons.map((polygon,index) => {
    const xs = polygon[0].map(point => point[0]);
    return { polygon, palette: index === 1 ? 1 : 0, left: Math.min(...xs), right: Math.max(...xs) };
  });
  const group = new THREE.Group();
  const panes = 36, pitch = width/panes, paneHeight = 5.1, thickness = 0.045;
  const sheets = [];
  const tigerMaterial = new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:THREE.DoubleSide,toneMapped:false,alphaTest:0.015,forceSinglePass:true});
  const glassMaterials = ['#b3a0d2','#ffe291'].map(color=>new THREE.MeshPhysicalMaterial({
    color, transmission:0.96, transparent:true, opacity:0.22, depthWrite:false,
    roughness:0.07, thickness, ior:1.46, metalness:0, clearcoat:1,
    clearcoatRoughness:0.06, envMapIntensity:1.7, side:THREE.FrontSide,
  }));
  const inkMaterials = ['#461D7C','#FDD023'].map(color=>new THREE.MeshPhysicalMaterial({
    color, transmission:0.52, transparent:true, opacity:1, depthWrite:false,
    roughness:0.1, thickness:0.12, ior:1.47, metalness:0.06,
    attenuationColor:new THREE.Color(color),attenuationDistance:1.3,
    clearcoat:1, clearcoatRoughness:0.07, envMapIntensity:1.35, side:THREE.FrontSide,
  }));
  const edgeMaterials = ['#71518e','#b18122'].map(color=>new THREE.LineBasicMaterial({color,transparent:true,opacity:0.22,depthWrite:false}));
  let pieceCount = 0;
  for (let i=0;i<panes;i++) {
    const x = -width/2+(i+0.5)*pitch;
    const x0=x-pitch*0.46,x1=x+pitch*0.46;
    const distance = letter => Math.max(letter.left-x,0,x-letter.right);
    const palette = letters.reduce((nearest,letter) => distance(letter)<distance(nearest) ? letter : nearest).palette;
    const sheet = new THREE.Group();
    const carrierGeometry = new THREE.BoxGeometry(pitch*0.97,paneHeight,thickness);
    const carrier = new THREE.Mesh(carrierGeometry,glassMaterials[palette]);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(carrierGeometry),edgeMaterials[palette]);
    sheet.add(carrier,edge);
    const artworkGeometry = new THREE.PlaneGeometry(pitch*0.97,paneHeight);
    const uv=artworkGeometry.getAttribute('uv');
    for(let v=0;v<uv.count;v++) uv.setX(v,(i+(0.015+uv.getX(v)*0.97))/panes);
    const artwork = new THREE.Mesh(artworkGeometry,tigerMaterial);
    artwork.position.z=thickness/2+0.002;
    artwork.renderOrder=3;
    sheet.add(artwork);
    const glyphs=[];
    for(const letter of letters) {
      if (x1 < letter.left || x0 > letter.right) continue;
      const clips = globalThis.polygonClipping.intersection([letter.polygon],[[[x0,-0.1],[x1,-0.1],[x1,5.4],[x0,5.4],[x0,-0.1]]]);
      for(const polygon of clips) {
        const shape = new THREE.Shape(polygon[0].map(([px,py])=>new THREE.Vector2(px-x,py-2.55)));
        for(const ring of polygon.slice(1)) shape.holes.push(new THREE.Path(ring.map(([px,py])=>new THREE.Vector2(px-x,py-2.55))));
        const geometry = new THREE.ExtrudeGeometry(shape,{depth:0.075,bevelEnabled:true,bevelSize:0.009,bevelThickness:0.012,bevelSegments:2,steps:1,curveSegments:12});
        const glyph = new THREE.Mesh(geometry,inkMaterials[letter.palette]);
        glyph.position.z=thickness/2+0.006;
        glyph.castShadow=true;
        sheet.add(glyph);glyphs.push(glyph);pieceCount++;
      }
    }
    group.add(sheet);
    sheets.push({sheet,artwork,glyphs,x,z:Math.sin(i/(panes-1)*Math.PI*3.25-0.45)*3.2+Math.cos(i*0.63)*0.38});
  }
  const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
  function update(phase) {
    const ink=smooth(0.14,0.47,phase);
    const tiger=1-smooth(0.12,0.49,phase);
    tigerMaterial.opacity=tiger;
    for(const material of inkMaterials) material.opacity=ink;
    for(const material of glassMaterials) material.opacity=0.04+0.19*smooth(0.02,0.3,phase)-0.17*smooth(0.72,1,phase);
    for(const material of edgeMaterials) material.opacity=0.015+0.19*smooth(0.04,0.32,phase)-0.16*smooth(0.72,1,phase);
    sheets.forEach(({sheet,artwork,glyphs,x,z},i)=>{
      const delay=0.035*i/(panes-1);
      const rise=smooth(delay,0.62+delay,phase);
      sheet.rotation.x=-Math.PI/2*(1-rise);
      sheet.scale.y=depth/paneHeight+(1-depth/paneHeight)*rise;
      sheet.position.set(x,2.55+Math.sin(Math.PI*rise)*0.65,z*rise);
      artwork.visible=tiger>0.002;
      for(const glyph of glyphs) {glyph.visible=ink>0.002;glyph.castShadow=ink>0.45;}
    });
  }
  update(0);
  return {group,width,depth,panes,pieceCount,gapCarriers:0,texture,update,thickness};
}
