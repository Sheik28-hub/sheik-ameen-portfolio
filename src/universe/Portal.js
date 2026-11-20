import * as THREE from 'three';

/**
 * SHEIK AMEEN — BEYOND THE UNIVERSE
 * CelestialPortals: 8 Interactive 3D Professional Navigation Portals
 * 
 * Directory:
 * 01. Skills (Power BI, SQL, Tableau, Financial Modeling)
 * 02. Projects (Shriram Default Risk, 3-Statement Model, JPMorgan M&A, Deloitte Forensic)
 * 03. LinkedIn (Verified professional profile)
 * 04. Email (ameensheik2902@gmail.com)
 * 05. Education (MBA Anna Univ, BBA Bharathidasan)
 * 06. Experience (KFin Technologies Ltd. - 35,000+ alerts)
 * 07. Certifications (CFA Candidate, Tableau, Power BI, SQL)
 * 08. Resume (PDF download)
 */

export class CelestialPortals {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);
    this.scene.add(this.group);

    this.portalData = [
      { id: 'skills', num: '01', title: 'SKILLS', target: '#skills', color: 0x00D4FF, desc: 'Power BI · SQL · Financial Modeling' },
      { id: 'projects', num: '02', title: 'PROJECTS', target: '#projects', color: 0x6865F2, desc: 'Credit Risk · DCF · BI Forensics' },
      { id: 'experience', num: '03', title: 'EXPERIENCE', target: '#experience', color: 0x00D4FF, desc: 'KFin Technologies Ltd. (Surveillance)' },
      { id: 'education', num: '04', title: 'EDUCATION', target: '#education', color: 0xC8D0DC, desc: 'MBA (Finance & Analytics) · BBA' },
      { id: 'certifications', num: '05', title: 'CREDENTIALS', target: '#certifications', color: 0xF59E0B, desc: 'CFA Candidate · Tableau · Power BI' },
      { id: 'resume', num: '06', title: 'RESUME', target: 'resume', color: 0x10B981, desc: 'Official Executive PDF Download' },
      { id: 'linkedin', num: '07', title: 'LINKEDIN', target: 'https://www.linkedin.com/in/sheik-ameen', color: 0x00D4FF, desc: 'Connect on Professional Network' },
      { id: 'email', num: '08', title: 'EMAIL', target: 'mailto:ameensheik2902@gmail.com', color: 0x6865F2, desc: 'ameensheik2902@gmail.com' }
    ];

    this.portals = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredPortal = null;
    this.onPortalSelect = null;

    this.initPortals();
    this.bindEvents();
  }

  initPortals() {
    const total = this.portalData.length;
    const orbitRadius = 24.0;

    this.portalData.forEach((data, i) => {
      const angle = (i / total) * Math.PI * 2;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      const y = Math.sin(i * 1.5) * 2.2;

      const portalGroup = new THREE.Group();
      portalGroup.position.set(x, y, z);
      portalGroup.lookAt(0, y, 0); // Face the central avatar

      // 1. Luminous Outer Ring
      const ringGeo = new THREE.TorusGeometry(2.4, 0.08, 16, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.85
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      portalGroup.add(ringMesh);

      // 2. Translucent Energy Membrane
      const membraneGeo = new THREE.CircleGeometry(2.3, 32);
      const membraneMat = new THREE.MeshStandardMaterial({
        color: 0x0D1422,
        emissive: data.color,
        emissiveIntensity: 0.22,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide
      });
      const membraneMesh = new THREE.Mesh(membraneGeo, membraneMat);
      membraneMesh.userData = { portalId: data.id, portalData: data };
      portalGroup.add(membraneMesh);

      // 3. Counter-rotating Accent Orbit
      const orbitGeo = new THREE.TorusGeometry(2.8, 0.03, 12, 36);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.4,
        wireframe: true
      });
      const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
      portalGroup.add(orbitMesh);

      this.group.add(portalGroup);
      this.portals.push({
        group: portalGroup,
        ring: ringMesh,
        membrane: membraneMesh,
        orbit: orbitMesh,
        data,
        baseColor: data.color
      });
    });
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    window.addEventListener('click', () => {
      if (this.hoveredPortal) {
        this.handleClick(this.hoveredPortal.data);
      }
    });
  }

  handleClick(data) {
    if (this.onPortalSelect) {
      this.onPortalSelect(data);
    }

    if (data.target.startsWith('http') || data.target.startsWith('mailto')) {
      window.open(data.target, '_blank');
    } else if (data.target === 'resume') {
      const link = document.createElement('a');
      link.href = './assets/resume/Sheik_Ameen_Resume.pdf';
      link.download = 'Sheik_Ameen_Resume.pdf';
      link.click();
    } else if (data.target.startsWith('#')) {
      const el = document.querySelector(data.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  update(elapsed) {
    // 1. Slow orbit around center
    this.group.rotation.y = elapsed * 0.04;

    // 2. Pulse portal rings
    this.portals.forEach((p, idx) => {
      p.orbit.rotation.z = -elapsed * 0.6 + idx;
      p.ring.rotation.z = elapsed * 0.3;
      const pulse = 1.0 + Math.sin(elapsed * 2.5 + idx) * 0.05;
      p.ring.scale.set(pulse, pulse, 1);
    });

    // 3. Raycast hover detection
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const meshes = this.portals.map(p => p.membrane);
    const intersects = this.raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const found = this.portals.find(p => p.membrane === hit);
      if (found) {
        this.hoveredPortal = found;
        document.body.style.cursor = 'pointer';
        found.ring.scale.set(1.15, 1.15, 1);
        found.membrane.material.emissiveIntensity = 0.65;
      }
    } else {
      if (this.hoveredPortal) {
        this.hoveredPortal.membrane.material.emissiveIntensity = 0.22;
        this.hoveredPortal = null;
        document.body.style.cursor = 'default';
      }
    }
  }
}

export default CelestialPortals;
