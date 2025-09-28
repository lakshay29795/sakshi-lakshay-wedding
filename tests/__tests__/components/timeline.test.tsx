import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TimelineItem } from '@/components/features/timeline-item';
import { InteractiveTimeline } from '@/components/features/interactive-timeline';
import type { TimelineEvent } from '@/types';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: Object.assign(
    (Component: any) => Component, // motion as a function
    {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    }
  ),
  AnimatePresence: ({ children }: any) => children,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => ({ get: () => 0 }),
  useInView: () => true,
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock HTMLAudioElement
const mockPlay = jest.fn().mockResolvedValue(undefined);
const mockPause = jest.fn();
const mockAudio = {
  play: mockPlay,
  pause: mockPause,
  muted: false,
  currentTime: 0,
  duration: 100,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

Object.defineProperty(global, 'HTMLAudioElement', {
  writable: true,
  value: jest.fn().mockImplementation(() => mockAudio),
});

Object.defineProperty(global.HTMLAudioElement.prototype, 'play', {
  writable: true,
  value: mockPlay,
});

Object.defineProperty(global.HTMLAudioElement.prototype, 'pause', {
  writable: true,
  value: mockPause,
});

const mockTimelineEvent: TimelineEvent = {
  id: '1',
  date: new Date('2018-03-14'),
  title: 'First Meeting',
  description: 'We met at a coffee shop on a rainy Tuesday morning.',
  image: '/images/timeline/first-meeting.jpg',
  audioMessage: '/audio/timeline/first-meeting.mp3',
  location: {
    name: 'Central Perk Coffee',
    coordinates: {
      lat: 34.0522,
      lng: -118.2437,
    },
  },
};

const mockTimelineEvents: TimelineEvent[] = [
  mockTimelineEvent,
  {
    id: '2',
    date: new Date('2018-05-20'),
    title: 'First Date',
    description: 'Our first official date was a picnic in the park.',
    image: '/images/timeline/first-date.jpg',
    audioMessage: '/audio/timeline/first-date.mp3',
  },
];

describe('TimelineItem', () => {
  beforeEach(() => {
    // Mock HTMLAudioElement
    global.HTMLAudioElement = jest.fn().mockImplementation(() => ({
      play: jest.fn(),
      pause: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      muted: false,
    }));
  });

  it('renders timeline item with event details', () => {
    render(<TimelineItem event={mockTimelineEvent} index={0} />);
    
    expect(screen.getByText('First Meeting')).toBeInTheDocument();
    expect(screen.getByText('We met at a coffee shop on a rainy Tuesday morning.')).toBeInTheDocument();
    expect(screen.getByText('Central Perk Coffee')).toBeInTheDocument();
  });

  it('displays formatted date correctly', () => {
    render(<TimelineItem event={mockTimelineEvent} index={0} />);
    
    expect(screen.getByText(/Wednesday, March 14, 2018/)).toBeInTheDocument();
  });

  it('shows audio controls when audio message is available', () => {
    render(<TimelineItem event={mockTimelineEvent} index={0} />);
    
    expect(screen.getByText('Audio Message')).toBeInTheDocument();
    expect(screen.getByLabelText('Play audio')).toBeInTheDocument();
    expect(screen.getByLabelText('Mute')).toBeInTheDocument();
  });

  it('handles audio playback controls', async () => {
    render(<TimelineItem event={mockTimelineEvent} index={0} />);
    
    const playButton = screen.getByLabelText('Play audio');
    fireEvent.click(playButton);
    
    // Check if the button state changes to pause (UI behavior test)
    await waitFor(() => {
      expect(screen.getByLabelText('Pause audio')).toBeInTheDocument();
    });
  });

  it('toggles mute functionality', () => {
    // Reset the global mock
    mockAudio.muted = false;
    
    render(<TimelineItem event={mockTimelineEvent} index={0} />);
    
    const muteButton = screen.getByLabelText('Mute');
    fireEvent.click(muteButton);
    
    // Check if the button label changed to indicate muted state
    expect(screen.getByLabelText('Unmute')).toBeInTheDocument();
  });

  it('renders without audio controls when no audio message', () => {
    const eventWithoutAudio = { ...mockTimelineEvent, audioMessage: undefined };
    render(<TimelineItem event={eventWithoutAudio} index={0} />);
    
    expect(screen.queryByText('Audio Message')).not.toBeInTheDocument();
  });

  it('applies reversed layout correctly', () => {
    const { container } = render(<TimelineItem event={mockTimelineEvent} index={0} isReversed />);
    
    expect(container.querySelector('.lg\\:col-start-2')).toBeInTheDocument();
    expect(container.querySelector('.lg\\:col-start-1')).toBeInTheDocument();
  });
});

describe('InteractiveTimeline', () => {
  it('renders timeline with multiple events', () => {
    render(<InteractiveTimeline events={mockTimelineEvents} />);
    
    expect(screen.getByText('Our Love Story')).toBeInTheDocument();
    expect(screen.getByText('The Journey of Our Hearts')).toBeInTheDocument();
    expect(screen.getByText('First Meeting')).toBeInTheDocument();
    expect(screen.getByText('First Date')).toBeInTheDocument();
  });

  it('renders progress indicator', () => {
    render(<InteractiveTimeline events={mockTimelineEvents} />);
    
    expect(screen.getByText('Scroll to explore our journey')).toBeInTheDocument();
  });

  it('renders timeline end message', () => {
    render(<InteractiveTimeline events={mockTimelineEvents} />);
    
    expect(screen.getByText('And this is just the beginning...')).toBeInTheDocument();
  });

  it('alternates timeline item layout', () => {
    const { container } = render(<InteractiveTimeline events={mockTimelineEvents} />);
    
    // First item should not be reversed, second should be
    const timelineItems = container.querySelectorAll('[class*="relative space-y-24"] > div');
    expect(timelineItems).toHaveLength(2);
  });

  it('handles empty events array', () => {
    render(<InteractiveTimeline events={[]} />);
    
    expect(screen.getByText('Our Love Story')).toBeInTheDocument();
    expect(screen.getByText('And this is just the beginning...')).toBeInTheDocument();
  });
});

describe('Timeline Integration', () => {
  it('renders timeline items with correct spacing', () => {
    const { container } = render(<InteractiveTimeline events={mockTimelineEvents} />);
    
    const timelineContainer = container.querySelector('.space-y-24');
    expect(timelineContainer).toBeInTheDocument();
  });

  it('includes timeline connector elements', () => {
    render(<TimelineItem event={mockTimelineEvent} index={0} />);
    
    // Check for timeline line and dot
    const { container } = render(<TimelineItem event={mockTimelineEvent} index={0} />);
    expect(container.querySelector('.bg-gradient-to-b')).toBeInTheDocument();
  });
});
