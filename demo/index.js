import './controllers.css';
import CI360 from '../src';

// ===== Scroll Reveal Animation =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.demo-reveal').forEach(el => revealObserver.observe(el));

// ===== Nav Scroll Behavior =====
const nav = document.getElementById('demo-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Active link highlighting
  const navLinks = nav.querySelectorAll('.demo-nav-links a');
  const sections = document.querySelectorAll('section[id]');

  const updateActiveLink = () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        const id = section.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
}

import {
  EARBUDS_PLUGIN,
  GURKHA_SUV_HOTSPOTS_CONFIG,
  NIKE_PLUGIN,
  PLUGIN_PROPS,
  PROPERTIES_COLORS,
  URL_PROPERTIES,
} from './constants';

// Hide heavy demo sections on mobile to prevent memory crashes
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);

if (isMobileDevice) {
  // Hide gallery section (100 images) and programmatic section (73 images)
  // This reduces total images from ~480 to ~306
  const gallerySection = document.querySelector('.gallery-section');
  const programmaticSection = document.querySelector('.programmatic-control-section');

  if (gallerySection) gallerySection.style.display = 'none';
  if (programmaticSection) programmaticSection.style.display = 'none';
}

const spinDirections = document.getElementById('spin-directions');
const copyText = document.getElementById('copy-text');
const codeBlock = document.getElementById('code-block');
const codeWrapper = document.getElementById('code-wrapper');
const copyButton = document.querySelector('.code-section .copy-button');
const outputCode = document.querySelector('.output-code');
const pluginCheckboxOptions = document.querySelectorAll('.plugin-option');
const imageXAmountSelector = document.getElementById('x-images-selector');
const imageYSelector = document.getElementById('images-y');
const autoplaySpeed = document.getElementById('spin-speed');
const dragSpeed = document.getElementById('drag-speed');

const customStylingCheckbox = document.getElementById('custom-styling-checkbox');
const customStylingWrapper = document.getElementById('custom-styling-wrapper');
const customStylingTextarea = document.getElementById('custom-styling-textarea');

const themeSelector = document.getElementById('theme-selector');
const hintOptions = document.querySelectorAll('.hint-option');

const folderPathOption = document.getElementById('folder-path-option');
const folderPathInput = document.getElementById('folder-path');
const filenamePatternInput = document.getElementById('filename-pattern');
const customImagesInput = document.getElementById('custom-images-input');
const nikeXImagesSelector = document.getElementById('nike-x-images');

const instance = new CI360();

function changeSpinDirectionHandler(event) {
  const spinDirection = event.target.value;
  const isYDirection = spinDirection === 'Y';
  const isCustom = spinDirection === 'custom';

  // Show/hide custom fields
  folderPathOption.style.display = isCustom ? 'block' : 'none';
  filenamePatternInput.disabled = !isCustom;

  // Show/hide appropriate image amount inputs
  imageXAmountSelector.style.display = (!isYDirection && !isCustom) ? 'block' : 'none';
  nikeXImagesSelector.style.display = isYDirection ? 'block' : 'none';
  customImagesInput.style.display = isCustom ? 'block' : 'none';

  // Show/hide Y-axis selector
  imageYSelector.style.display = isYDirection ? 'block' : 'none';

  if (isCustom) {
    // For custom, use current input values or defaults
    const folder = folderPathInput.value || '';
    const filename = filenamePatternInput.value || '{index}.jpg';
    const amountX = parseInt(customImagesInput.value, 10) || 36;

    if (folder) {
      const updatedView = instance.updateView('demo-generator', {
        folder,
        filenameX: filename,
        amountX,
        amountY: 0,
        filenameY: null,
      });
      updateCodeBlock(updatedView.viewerConfig);
    }
  } else {
    // Preset datasets
    const config = isYDirection ? NIKE_PLUGIN : EARBUDS_PLUGIN;
    const updatedView = instance.updateView('demo-generator', config);

    // Set the selector values
    if (isYDirection) {
      nikeXImagesSelector.value = 35;
    } else {
      imageXAmountSelector.value = 233;
    }

    // Update filename pattern display
    filenamePatternInput.value = isYDirection ? '{index}.jpg' : '{index}.jpg';

    updateCodeBlock(updatedView.viewerConfig);
  }
}

function changeCustomFolder(event) {
  const folder = event.target.value;
  const filename = filenamePatternInput.value || '{index}.jpg';
  const amountX = parseInt(customImagesInput.value, 10) || 36;

  if (folder) {
    const updatedView = instance.updateView('demo-generator', {
      folder,
      filenameX: filename,
      amountX,
    });
    updateCodeBlock(updatedView.viewerConfig);
  }
}

function changeFilenamePattern(event) {
  const filename = event.target.value;
  const folder = folderPathInput.value;

  if (folder && filename) {
    const updatedView = instance.updateView('demo-generator', {
      filenameX: filename,
    });
    updateCodeBlock(updatedView.viewerConfig);
  }
}

function changeCustomImageAmount(event) {
  const amountX = parseInt(event.target.value, 10);

  if (amountX > 0) {
    const updatedView = instance.updateView('demo-generator', { amountX });
    updateCodeBlock(updatedView.viewerConfig);
  }
}

function changeDragSpeed(event) {
  const { value } = event.target;
  const updatedView = instance.updateView('demo-generator', { dragSpeed: parseInt(value, 10) });

  updateCodeBlock(updatedView.viewerConfig);
}

function changeAutoplaySpeed(event) {
  const { value } = event.target;
  const updatedView = instance.updateView('demo-generator', { speed: parseInt(value, 10) });

  updateCodeBlock(updatedView.viewerConfig);
}

function copyCodeHandler() {
  navigator.clipboard.writeText(outputCode.innerText);

  copyText.innerHTML = 'Copied';

  setTimeout(() => {
    copyText.innerHTML = 'Copy';
  }, 500);
}

function changeImageXAmount(event) {
  const { value } = event.target;
  const updatedView = instance.updateView('demo-generator', { amountX: parseInt(value, 10) });

  updateCodeBlock(updatedView.viewerConfig);
}

function pluginCheckboxOptionsHandler(event) {
  const checked = event.target.checked;
  const key = event.target.getAttribute('data-plugin-property');
  const pluginValue = event.target.getAttribute('data-plugin-value');

  let value = checked;
  if (pluginValue) {
    value = checked ? JSON.parse(pluginValue) : undefined;
  }

  const updatedView = instance.updateView('demo-generator', { [key]: value });

  updateCodeBlock(updatedView.viewerConfig);
}

function updateCodeBlock(config) {
  codeBlock.innerText = '';
  const configKeys = Object.keys(config);
  const keys = configKeys.filter((key) => PLUGIN_PROPS[key] && !!config[key]);

  keys.forEach((key) => {
    const { label } = PLUGIN_PROPS[key];
    const propertyWrapper = document.createElement('div');
    const propertyName = document.createElement('span');
    const propertyValue = document.createElement('span');

    propertyName.innerText = label;

    propertyName.style.color = PROPERTIES_COLORS.NAME;

    if (URL_PROPERTIES.includes(key)) {
      propertyValue.style.color = PROPERTIES_COLORS.URL;
    }

    propertyWrapper.appendChild(propertyName);

    propertyValue.innerText = `"${config[key]}"`;

    propertyWrapper.innerHTML += '=';
    propertyWrapper.appendChild(propertyValue);

    codeBlock.appendChild(propertyWrapper);
    codeWrapper.scrollTop = codeWrapper.scrollHeight;
  });
}

dragSpeed.addEventListener('change', changeDragSpeed);
autoplaySpeed.addEventListener('change', changeAutoplaySpeed);
imageXAmountSelector.addEventListener('change', changeImageXAmount);
spinDirections.addEventListener('change', changeSpinDirectionHandler);
copyButton.addEventListener('click', copyCodeHandler);
folderPathInput.addEventListener('change', changeCustomFolder);
filenamePatternInput.addEventListener('change', changeFilenamePattern);
customImagesInput.addEventListener('change', changeCustomImageAmount);
nikeXImagesSelector.addEventListener('change', changeImageXAmount);
pluginCheckboxOptions.forEach((option) => {
  option.addEventListener('change', pluginCheckboxOptionsHandler);
});

const suvCarContainer = document.getElementById('gurkha-suv');

// Generate evenly distributed image list for mobile (every Nth image for full 360° coverage)
const generateMobileImageList = (folder, pattern, totalImages, targetCount) => {
  const step = Math.floor(totalImages / targetCount);
  const images = [];
  for (let i = 1; i <= totalImages && images.length < targetCount; i += step) {
    images.push(`${folder}${pattern.replace('{index}', i)}`);
  }
  return images;
};

// SUV: 73 images -> 36 on mobile (every 2nd image for full rotation)
const suvMobileImages = generateMobileImageList(
  'https://scaleflex.cloudimg.io/v7/demo/suv-orange-car-360/',
  'orange-{index}.jpg',
  73,
  36
);

const config = {
  folder: 'https://scaleflex.cloudimg.io/v7/demo/suv-orange-car-360/',
  filenameX: 'orange-{index}.jpg',
  // On mobile: use evenly distributed images for full 360° coverage
  ...(isMobileDevice
    ? { imageListX: suvMobileImages }
    : { amountX: 73 }),
  lazyload: true,
  speed: 120,
  zoomMax: 3,
  responsive: 'scaleflex',
  autoplay: true,
  fullscreen: true,
  playOnce: true,
  bottomCircle: false,
  hotspots: isMobileDevice ? undefined : GURKHA_SUV_HOTSPOTS_CONFIG, // Disable hotspots on mobile
  inertia: true,
  hints: true, // Auto-detect: swipe+pinch on mobile, drag+click on desktop
};

instance.init(suvCarContainer, config);

// Initialize demo-generator with event callbacks
const demoGeneratorContainer = document.getElementById('demo-generator');

// Earbuds: 233 images -> 36 on mobile (every ~6th image for full rotation)
const earbudsMobileImages = generateMobileImageList(
  'https://scaleflex.cloudimg.io/v7/demo/earbuds/',
  '{index}.jpg',
  233,
  36
);

// Use fewer images on mobile to prevent memory crashes
const demoGeneratorConfig = {
  folder: 'https://scaleflex.cloudimg.io/v7/demo/earbuds/',
  filenameX: '{index}.jpg',
  // On mobile: use evenly distributed images for full 360° coverage
  ...(isMobileDevice
    ? { imageListX: earbudsMobileImages }
    : { amountX: 233 }),
  autoplay: true,
  speed: 100,
  dragSpeed: 100,
  bottomCircle: false,
  fullscreen: true,
  keys: true,
  responsive: 'scaleflex',
  lazyload: true,
  hints: false,
  // Event callbacks - only log on desktop to avoid memory pressure from logging
  ...(isMobileDevice ? {} : {
    onReady: (event) => {
      console.log('onReady:', event.viewerId);
    },
    onLoad: (event) => {
      console.log('onLoad:', `${event.imagesX} images loaded`);
    },
    onSpin: (event) => {
      console.log('onSpin:', `Frame ${event.activeImageX + 1}/${event.amountX}`, event.direction);
    },
    onAutoplayStart: (event) => {
      console.log('onAutoplayStart:', event.viewerId);
    },
    onAutoplayStop: (event) => {
      console.log('onAutoplayStop:', event.viewerId);
    },
    onFullscreenOpen: (event) => {
      console.log('onFullscreenOpen:', event.viewerId);
    },
    onFullscreenClose: (event) => {
      console.log('onFullscreenClose:', event.viewerId);
    },
    onZoomIn: (event) => {
      console.log('onZoomIn:', `zoom level ${event.zoomLevel}`);
    },
    onZoomOut: (event) => {
      console.log('onZoomOut:', event.viewerId);
    },
    onDragStart: (event) => {
      console.log('onDragStart:', event.viewerId);
    },
    onDragEnd: (event) => {
      console.log('onDragEnd:', event.viewerId);
    },
  }),
};

instance.init(demoGeneratorContainer, demoGeneratorConfig);

const demoGeneratorInstance = instance.getViewById('demo-generator');

updateCodeBlock(demoGeneratorInstance.viewerConfig);

// Custom styling functionality
let customStyleElement = null;
let cssDebounceTimer = null;

function toggleCustomStyling(event) {
  const isChecked = event.target.checked;
  customStylingWrapper.style.display = isChecked ? 'block' : 'none';

  if (isChecked) {
    // Apply CSS when enabling
    applyCustomCss();
  } else if (customStyleElement) {
    customStyleElement.remove();
    customStyleElement = null;
  }
}

function scopeCssToInstance(css, instanceId) {
  // Strip comments for selector parsing but keep them in output
  const stripComments = (str) => str.replace(/\/\*[\s\S]*?\*\//g, '').trim();

  // Parse CSS and prefix each selector with the instance ID
  return css.replace(
    /(\/\*[\s\S]*?\*\/\s*)?([^\{\}]+)\{/g,
    (match, comment, selectors) => {
      const prefix = comment || '';
      const scopedSelectors = selectors
        .split(',')
        .map((selector) => {
          // Remove any inline comments from selector
          const trimmed = stripComments(selector);
          if (!trimmed) return '';
          // Handle selectors that already start with the instance
          if (trimmed.startsWith(`#${instanceId}`)) {
            return trimmed;
          }
          // Handle .cloudimage-360 - apply directly to container (no space)
          if (trimmed === '.cloudimage-360') {
            return `#${instanceId}`;
          }
          // Scope the selector to the instance
          return `#${instanceId} ${trimmed}`;
        })
        .filter(Boolean)
        .join(', ');
      return `${prefix}${scopedSelectors} {`;
    }
  );
}

function applyCustomCss() {
  const css = customStylingTextarea.value.trim();

  // Remove existing custom style if present
  if (customStyleElement) {
    customStyleElement.remove();
    customStyleElement = null;
  }

  if (!css) return;

  // Create scoped CSS
  const scopedCss = scopeCssToInstance(css, 'demo-generator');

  // Create and inject style element
  customStyleElement = document.createElement('style');
  customStyleElement.id = 'demo-generator-custom-styles';
  customStyleElement.textContent = scopedCss;
  document.head.appendChild(customStyleElement);
}

function handleCssInput() {
  // Only apply if custom styling is enabled
  if (!customStylingCheckbox.checked) return;

  // Debounce to avoid too frequent updates while typing
  clearTimeout(cssDebounceTimer);
  cssDebounceTimer = setTimeout(applyCustomCss, 150);
}

customStylingCheckbox.addEventListener('change', toggleCustomStyling);
customStylingTextarea.addEventListener('input', handleCssInput);

// Theme handler
function changeTheme(event) {
  const { value } = event.target;
  const updatedView = instance.updateView('demo-generator', { theme: value });
  updateCodeBlock(updatedView.viewerConfig);
}

themeSelector.addEventListener('change', changeTheme);

// Hints selection handler
function getSelectedHints() {
  const selectedHints = [];
  hintOptions.forEach((option) => {
    if (option.checked) {
      selectedHints.push(option.getAttribute('data-hint'));
    }
  });
  return selectedHints.length > 0 ? selectedHints : false;
}

function changeHints() {
  const hints = getSelectedHints();
  const updatedView = instance.updateView('demo-generator', { hints });
  updateCodeBlock(updatedView.viewerConfig);
}

hintOptions.forEach((option) => {
  option.addEventListener('change', changeHints);
});

// Initialize all gallery examples with cloudimage-360 class
// Note: Memory management is automatically enabled on mobile devices
instance.initAll();

// ===== Programmatic Control Section =====
const programmaticViewer = instance.getViewById('programmatic-viewer');
const frameDisplay = document.getElementById('frame-display');

// Update frame display using rAF loop so it stays in sync during
// autoplay, drag, and programmatic moves (onSpin only fires on drag)
let lastDisplayedFrame = -1;

function updateFrameDisplay() {
  if (programmaticViewer && frameDisplay) {
    const current = programmaticViewer.activeImageX + 1;
    const total = programmaticViewer.amountX;

    if (current !== lastDisplayedFrame) {
      lastDisplayedFrame = current;
      frameDisplay.textContent = `Frame: ${current} / ${total}`;
    }
  }
  requestAnimationFrame(updateFrameDisplay);
}

if (programmaticViewer) {
  requestAnimationFrame(updateFrameDisplay);
}

// Helper to hide icons on first interaction
function hideIconsOnInteraction() {
  if (programmaticViewer) {
    programmaticViewer.hideAllIcons();
  }
}

// Play button
document.getElementById('btn-play')?.addEventListener('click', () => {
  if (programmaticViewer) {
    hideIconsOnInteraction();
    programmaticViewer.play();
  }
});

// Stop button
document.getElementById('btn-stop')?.addEventListener('click', () => {
  if (programmaticViewer) {
    programmaticViewer.stopAutoplay();
  }
});

// Rotate Left button
document.getElementById('btn-left')?.addEventListener('click', () => {
  if (programmaticViewer) {
    hideIconsOnInteraction();
    programmaticViewer.moveLeft(false, 5);
    updateFrameDisplay();
  }
});

// Rotate Right button
document.getElementById('btn-right')?.addEventListener('click', () => {
  if (programmaticViewer) {
    hideIconsOnInteraction();
    programmaticViewer.moveRight(false, 5);
    updateFrameDisplay();
  }
});

// Frame navigation buttons
document.getElementById('btn-frame-0')?.addEventListener('click', () => {
  if (programmaticViewer) {
    hideIconsOnInteraction();
    programmaticViewer.animateToFrame(0);
    setTimeout(updateFrameDisplay, 100);
  }
});

document.getElementById('btn-frame-36')?.addEventListener('click', () => {
  if (programmaticViewer) {
    hideIconsOnInteraction();
    programmaticViewer.animateToFrame(36);
    setTimeout(updateFrameDisplay, 100);
  }
});

document.getElementById('btn-frame-72')?.addEventListener('click', () => {
  if (programmaticViewer) {
    hideIconsOnInteraction();
    programmaticViewer.animateToFrame(72);
    setTimeout(updateFrameDisplay, 100);
  }
});

// ===== 2D Grid Mode Section =====
const gridContainer = document.getElementById('grid-2d-viewer');
const gridPositionLabel = document.getElementById('grid-position');

if (gridContainer) {
  const lampImages = [
    // y=0 (row 001)
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_001.jpg?vh=f02a2c',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_002.jpg?vh=73b02e',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_003.jpg?vh=66efd4',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_004.jpg?vh=c1d5e7',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_005.jpg?vh=e695f5',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_006.jpg?vh=ec5990',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_007.jpg?vh=f48f93',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_008.jpg?vh=b29da4',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_009.jpg?vh=90aadd',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_010.jpg?vh=6ec4e0',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_011.jpg?vh=388d82',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_012.jpg?vh=7d50c6',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_013.jpg?vh=7a8234',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_014.jpg?vh=65b6b0',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_015.jpg?vh=9165ed',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_016.jpg?vh=4e81f9',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_017.jpg?vh=b4f098',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_018.jpg?vh=812160',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_019.jpg?vh=86bebb',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_020.jpg?vh=12abee',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_021.jpg?vh=a983f6',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_022.jpg?vh=18fde7',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_023.jpg?vh=f20438',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_001_024.jpg?vh=e14886',
    // y=1 (row 002)
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_001.jpg?vh=625dc4',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_002.jpg?vh=64e2b5',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_003.jpg?vh=ce6b3d',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_004.jpg?vh=883dc2',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_005.jpg?vh=2f525d',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_006.jpg?vh=56375f',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_007.jpg?vh=3df812',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_008.jpg?vh=a4a3aa',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_009.jpg?vh=b78d2e',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_010.jpg?vh=af98bd',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_011.jpg?vh=1e9459',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_012.jpg?vh=69eaa0',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_013.jpg?vh=7f0fa2',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_014.jpg?vh=3c4c20',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_015.jpg?vh=ffbcaa',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_016.jpg?vh=54656b',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_017.jpg?vh=d39f1a',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_018.jpg?vh=d391d6',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_019.jpg?vh=f23a26',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_020.jpg?vh=4f3869',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_021.jpg?vh=eb574c',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_022.jpg?vh=a058a7',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_023.jpg?vh=71e252',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_002_024.jpg?vh=b1edf4',
    // y=2 (row 003)
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_001.jpg?vh=fdce83',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_002.jpg?vh=6fceb2',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_003.jpg?vh=963d2d',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_004.jpg?vh=0d4ba6',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_005.jpg?vh=ef180a',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_006.jpg?vh=a7d4c2',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_007.jpg?vh=8e7700',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_008.jpg?vh=c284dc',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_009.jpg?vh=8520fc',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_010.jpg?vh=057bca',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_011.jpg?vh=d03449',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_012.jpg?vh=c37c26',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_013.jpg?vh=d59523',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_014.jpg?vh=fb7d52',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_015.jpg?vh=5e64c9',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_016.jpg?vh=4e5628',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_017.jpg?vh=d21c04',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_018.jpg?vh=11770d',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_019.jpg?vh=0e56da',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_020.jpg?vh=de4e62',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_021.jpg?vh=1fadcb',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_022.jpg?vh=29f2c3',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_023.jpg?vh=13fa83',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_003_024.jpg?vh=dae488',
    // y=3 (row 004)
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_001.jpg?vh=4f91ec',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_002.jpg?vh=301889',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_003.jpg?vh=10c4e9',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_004.jpg?vh=25de7f',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_005.jpg?vh=40e13e',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_006.jpg?vh=b62777',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_007.jpg?vh=0a9003',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_008.jpg?vh=c35c7a',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_009.jpg?vh=b73b66',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_010.jpg?vh=48a73a',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_011.jpg?vh=469d18',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_012.jpg?vh=91651f',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_013.jpg?vh=e3f839',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_014.jpg?vh=cb1c48',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_015.jpg?vh=dee0ca',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_016.jpg?vh=96b7e9',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_017.jpg?vh=bd008e',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_018.jpg?vh=3e0b86',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_019.jpg?vh=84dfd4',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_020.jpg?vh=ba24db',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_021.jpg?vh=e7fb07',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_022.jpg?vh=a9a0a5',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_023.jpg?vh=b8848d',
    'https://fbmjmuoeb.filerobot.com/360%20images/lamp/20000064001612d_2d_004_024.jpg?vh=a76907',
  ];

  // Tab switching
  const gridTabs = document.querySelectorAll('.demo-grid-tab');
  const gridPanels = document.querySelectorAll('.demo-grid-panel');

  gridTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      gridTabs.forEach((t) => t.classList.remove('active'));
      gridPanels.forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`grid-panel-${tab.dataset.tab}`).classList.add('active');
    });
  });

  // Code example content
  const codeExample = `CI360.init(document.getElementById('viewer'), {
  folder: 'https://cdn.example.com/lamp/',
  filenameGrid: 'lamp_{indexY}_{indexX}.jpg',
  amountX: 24,
  amountY: 4,
  indexZeroBase: 3,     // zero-pad to 3 digits: 001, 002, ...
  stopAtEdgesY: true,
});`;

  const codeBlock = document.getElementById('grid-code-block');
  if (codeBlock) {
    codeBlock.textContent = codeExample;
    if (typeof Prism !== 'undefined') Prism.highlightElement(codeBlock);
  }

  // Copy button
  const copyBtn = document.getElementById('grid-copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeExample);
        copyBtn.textContent = 'Copied!';
      } catch {
        copyBtn.textContent = 'Failed';
      }
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
    });
  }

  instance.init(gridContainer, {
    imageListGrid: lampImages,
    amountX: 24,
    amountY: 4,
    keys: true,
    fullscreen: true,
    inertia: true,
    hints: true,
    stopAtEdgesY: true,
    bottomCircle: false,
    onSpin: ({ activeImageX, activeImageY }) => {
      if (gridPositionLabel) {
        gridPositionLabel.textContent = `Position: (${activeImageX}, ${activeImageY})`;
      }
    },
  });
}

// ===== Also by Scaleflex — slide auto-rotation =====
{
  const slides = document.querySelectorAll('.demo-also-slide');
  const dotsContainer = document.getElementById('also-dots');
  if (slides.length > 0 && dotsContainer) {
    let current = 0;
    let animating = false;
    let timer;

    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('button');
      dot.className = `demo-also-dot${i === 0 ? ' demo-also-dot--active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }

    function clearAnimClasses(el) {
      el.classList.remove(
        'demo-also-slide--enter-right', 'demo-also-slide--enter-left',
        'demo-also-slide--leave-left', 'demo-also-slide--leave-right',
      );
    }

    function goTo(index) {
      if (index === current || animating) return;
      animating = true;
      const forward = index > current || (current === slides.length - 1 && index === 0);
      const prev = slides[current];
      const next = slides[index];

      clearAnimClasses(prev);
      prev.classList.remove('demo-also-slide--active');
      prev.classList.add(forward ? 'demo-also-slide--leave-left' : 'demo-also-slide--leave-right');

      clearAnimClasses(next);
      next.classList.add(forward ? 'demo-also-slide--enter-right' : 'demo-also-slide--enter-left');

      next.addEventListener('animationend', function handler() {
        next.removeEventListener('animationend', handler);
        clearAnimClasses(prev);
        clearAnimClasses(next);
        next.classList.add('demo-also-slide--active');
        animating = false;
      });

      current = index;
      dotsContainer.querySelectorAll('.demo-also-dot').forEach((d, i) => {
        d.classList.toggle('demo-also-dot--active', i === current);
      });
      resetTimer();
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(() => {
        goTo((current + 1) % slides.length);
      }, 5000);
    }

    resetTimer();
  }
}
