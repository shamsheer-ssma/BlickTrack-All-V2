// Responsive design utilities and breakpoints

export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Responsive class generator
export function getResponsiveClasses(
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string,
  xl2?: string
): string {
  const classes = [base];
  
  if (sm) classes.push(`sm:${sm}`);
  if (md) classes.push(`md:${md}`);
  if (lg) classes.push(`lg:${lg}`);
  if (xl) classes.push(`xl:${xl}`);
  if (xl2) classes.push(`2xl:${xl2}`);
  
  return classes.join(' ');
}

// Grid responsive classes
export const gridClasses = {
  // Grid columns
  cols1: 'grid-cols-1',
  cols2: 'grid-cols-2',
  cols3: 'grid-cols-3',
  cols4: 'grid-cols-4',
  cols5: 'grid-cols-5',
  cols6: 'grid-cols-6',
  cols12: 'grid-cols-12',
  
  // Responsive grid
  responsive: {
    '1-2-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '1-2-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    '1-3-4': 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-4',
    '2-3-4': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    '1-2-3-4': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }
} as const;

// Spacing responsive classes
export const spacingClasses = {
  // Padding
  padding: {
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
    responsive: 'p-4 md:p-6 lg:p-8'
  },
  
  // Margin
  margin: {
    xs: 'm-2',
    sm: 'm-4',
    md: 'm-6',
    lg: 'm-8',
    xl: 'm-12',
    responsive: 'm-4 md:m-6 lg:m-8'
  },
  
  // Gap
  gap: {
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
    responsive: 'gap-4 md:gap-6 lg:gap-8'
  }
} as const;

// Typography responsive classes
export const typographyClasses = {
  // Headings
  h1: 'text-2xl md:text-3xl lg:text-4xl font-bold',
  h2: 'text-xl md:text-2xl lg:text-3xl font-semibold',
  h3: 'text-lg md:text-xl lg:text-2xl font-semibold',
  h4: 'text-base md:text-lg lg:text-xl font-medium',
  h5: 'text-sm md:text-base lg:text-lg font-medium',
  h6: 'text-xs md:text-sm lg:text-base font-medium',
  
  // Body text
  body: 'text-sm md:text-base',
  small: 'text-xs md:text-sm',
  large: 'text-base md:text-lg',
  
  // Responsive text
  responsive: {
    'xs-sm': 'text-xs sm:text-sm',
    'sm-base': 'text-sm md:text-base',
    'base-lg': 'text-base md:text-lg',
    'lg-xl': 'text-lg md:text-xl'
  }
} as const;

// Layout responsive classes
export const layoutClasses = {
  // Container
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  containerSm: 'max-w-3xl mx-auto px-4 sm:px-6',
  containerMd: 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8',
  containerLg: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  
  // Flexbox
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    column: 'flex flex-col',
    row: 'flex flex-row',
    wrap: 'flex flex-wrap',
    nowrap: 'flex flex-nowrap',
    responsive: 'flex flex-col md:flex-row'
  },
  
  // Grid
  grid: {
    auto: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    fixed: 'grid grid-cols-12 gap-4',
    responsive: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }
} as const;

// Component responsive classes
export const componentClasses = {
  // Cards
  card: 'bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6',
  cardHover: 'bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow',
  
  // Buttons
  button: {
    primary: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors',
    secondary: 'px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors',
    responsive: 'px-3 py-2 md:px-4 md:py-2 text-sm md:text-base'
  },
  
  // Forms
  form: {
    input: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    textarea: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none',
    select: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  },
  
  // Tables
  table: {
    container: 'overflow-x-auto',
    table: 'min-w-full divide-y divide-gray-200',
    th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    td: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
  }
} as const;

// Responsive visibility classes
export const visibilityClasses = {
  // Show only on specific breakpoints
  show: {
    xs: 'block sm:hidden',
    sm: 'hidden sm:block md:hidden',
    md: 'hidden md:block lg:hidden',
    lg: 'hidden lg:block xl:hidden',
    xl: 'hidden xl:block 2xl:hidden',
    '2xl': 'hidden 2xl:block'
  },
  
  // Hide on specific breakpoints
  hide: {
    xs: 'hidden sm:block',
    sm: 'block sm:hidden md:block',
    md: 'block md:hidden lg:block',
    lg: 'block lg:hidden xl:block',
    xl: 'block xl:hidden 2xl:block',
    '2xl': 'block 2xl:hidden'
  }
} as const;

// Responsive hook for JavaScript
export function useResponsive() {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>('md');
  
  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= 1536) setBreakpoint('2xl');
      else if (width >= 1280) setBreakpoint('xl');
      else if (width >= 1024) setBreakpoint('lg');
      else if (width >= 768) setBreakpoint('md');
      else if (width >= 640) setBreakpoint('sm');
      else setBreakpoint('xs');
    };
    
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);
  
  return {
    breakpoint,
    isXs: breakpoint === 'xs',
    isSm: breakpoint === 'sm',
    isMd: breakpoint === 'md',
    isLg: breakpoint === 'lg',
    isXl: breakpoint === 'xl',
    is2Xl: breakpoint === '2xl',
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl'
  };
}

// Responsive image classes
export const imageClasses = {
  responsive: 'w-full h-auto',
  cover: 'w-full h-full object-cover',
  contain: 'w-full h-full object-contain',
  rounded: 'rounded-lg',
  circle: 'rounded-full',
  shadow: 'shadow-lg'
} as const;

// Animation responsive classes
export const animationClasses = {
  fadeIn: 'animate-fade-in',
  slideIn: 'animate-slide-in',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  responsive: 'animate-fade-in md:animate-slide-in'
} as const;
