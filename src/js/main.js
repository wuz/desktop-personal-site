const pauseEvent = (e) => {
  if (e.stopPropagation) e.stopPropagation();
  if (e.preventDefault) e.preventDefault();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
};
const startDrag = (win) => (e) => {
  win.setAttribute('data-dragging', true);
  const evt = e.type === 'touchstart' ? e.changedTouches[0] : e;
  const offsetTop = evt.clientY - win.offsetTop;
  const offsetLeft = evt.clientX - win.offsetLeft;
  win.setAttribute('data-offset-top', offsetTop);
  win.setAttribute('data-offset-left', offsetLeft);
  window.addEventListener('mouseup', stopDrag(win));
  window.addEventListener('mousemove', drag(win));
  win.querySelector('.window-title').style.cursor = 'grabbing';
  updateTopWindow(win);
};

const stopDrag = (win) => (e) => {
  win.removeAttribute('data-dragging');
  window.removeEventListener('mouseup', stopDrag(win));
  window.removeEventListener('mousemove', drag(win));
  win.querySelector('.window-title').style.cursor = 'grab';
};

const setWindowPosition = (win, left, top) => {
  const padding = 20;
  const bottomPadding = document.querySelector(".taskbar").clientHeight;
  const edges = {
    top: 0,
    left: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
  };
  if (left < edges.left + padding) {
    left = edges.left + padding;
  }
  if (top < edges.top + padding) {
    top = edges.top + padding;
  }
  if (left + win.clientWidth > edges.right - padding) {
    left = edges.right - win.clientWidth - padding;
  }
  if (top + win.clientHeight > edges.bottom - bottomPadding) {
    top = edges.bottom - win.clientHeight - bottomPadding;
  }
  win.style.left = `${left}px`;
  win.style.top = `${top}px`;
};

const drag = (win) => (e) => {
  const evt = e.type === 'touchmove' ? e.changedTouches[0] : e;
  if (Boolean(win.dataset.dragging)) {
    pauseEvent(evt);
    const { offsetLeft, offsetTop } = win.dataset;
    let left = evt.clientX - offsetLeft;
    let top = evt.clientY - offsetTop;
    setWindowPosition(win, left, top);
  }
};

const setWindowInitialPosition = (win) => {
  const initialPosition = win.dataset.initialPosition;
  const initialVisibility = win.dataset.initialVisibility;
  let left, top;
  switch (initialPosition) {
    case 'center':
      left = (window.innerWidth - win.clientWidth) / 2;
      top = (window.innerHeight - win.clientHeight) / 2;
      break;
    case 'random':
      left = Math.random() * window.innerWidth - win.clientWidth;
      top = Math.random() * window.innerHeight - win.clientHeight;
      break;
  }
  setWindowPosition(win, left, top);
  setWindowVisibility(win, initialVisibility);
};

const setWindowVisibility = (win, visibility) => {
  const alwaysOpen = win.dataset.alwaysOpen;
  if (alwaysOpen || visibility === 'shown') {
    win.style.display = '';
  } else {
    win.style.display = 'none';
  }
}

const updateTopWindow = (win) => {
  const windows = document.querySelectorAll('.window');
  windows.forEach((w) => {
    w.style.zIndex = 10;
  });
  win.style.zIndex = 11;
};

const desktopify = () => {
  if(window.innerWidth < 600) return;
  const windows = document.querySelectorAll('.window');
  document.body.style.overflow = 'hidden';
  windows.forEach((win) => {
    win.style.position = 'absolute';
    win.style.zIndex = 10;
    win.style.width = `${win.clientWidth}px`;
    setWindowInitialPosition(win);
    const dragHandle = win.querySelector('.window-title');
    dragHandle.style.cursor = 'grab';
    dragHandle.addEventListener('mousedown', startDrag(win));
  });
  const icons = document.querySelectorAll('.icon');
  icons.forEach((icon) => {
    icon.addEventListener('click', () => {
      const win = document.getElementById(icon.dataset.window);
      setWindowVisibility(win, "shown");
    });
  });
  const closeButtons = document.querySelectorAll('.close');
  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const win = button.parentElement.parentElement;
      const alwaysOpen = win.dataset.alwaysOpen;
      if(Boolean(alwaysOpen)) return;
      setWindowVisibility(win, "hidden");
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  desktopify();

  // const getMultiversePosts = () =>
  //   fetch(`https://multiverse.plus/feed/user/wuz/json`, {
  //     credentials: 'include',
  //     mode: 'cors',
  //   }).then((res) => res.json());
  //
  // getMultiversePosts().then(console.log);

  // const allPosts = Promise.all([getMultiversePosts()]);
  //
  // allPosts.then(posts => {
  //  console.log(posts);
  // }).catch(err => console.error(err));
});
