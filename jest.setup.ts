import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; [key: string]: any }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return {
      type: 'img',
      props: {
        ...props,
        alt: props.alt || '',
      },
    };
  },
}));

// Mock Three.js and related modules
jest.mock('three', () => ({
  Scene: jest.fn(),
  PerspectiveCamera: jest.fn(),
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
    shadowMap: {},
    domElement: document.createElement('canvas')
  })),
  Vector2: jest.fn(() => ({
    x: 0,
    y: 0,
    set: jest.fn()
  })),
  Vector3: jest.fn(() => ({
    x: 0,
    y: 0,
    z: 0,
    set: jest.fn()
  })),
  Mesh: jest.fn(),
  Color: jest.fn(),
  MeshStandardMaterial: jest.fn(),
  BoxGeometry: jest.fn(),
  Group: jest.fn(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    children: []
  }))
}));

// Mock @react-three/fiber
jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
  useThree: jest.fn(() => ({
    scene: {},
    camera: {},
    gl: {
      domElement: document.createElement('canvas')
    }
  })),
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-canvas">{children}</div>
  )
}));

// Mock @react-three/drei
jest.mock('@react-three/drei', () => ({
  OrbitControls: jest.fn(() => null),
  PerspectiveCamera: jest.fn(() => null),
  useGLTF: jest.fn(() => ({
    scene: {},
    nodes: {},
    materials: {}
  }))
}));

// Suppress console errors during tests
console.error = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
