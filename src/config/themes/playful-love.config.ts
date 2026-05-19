/**
 * PLAYFUL LOVE THEME CONFIGURATION
 * Fun, energetic design with quirky and colorful elements
 * 
 * ALL CONTENT IS CONFIG-BASED - No hardcoded data in components!
 */

export const playfulLoveTheme = {
  name: 'Playful Love',
  slug: 'playful-love',
  description: 'Fun, energetic design with quirky and colorful romantic elements',
  
  // ============================================
  // COLORS & STYLING
  // ============================================
  colors: {
    primary: '#FF1744',       // Bright Red
    secondary: '#FF4081',     // Hot Pink
    accent: '#FFD54F',        // Yellow
    background: '#FFF9C4',    // Light Yellow
    backgroundAlt: '#FFF3E0', // Light Orange
    text: '#5D4037',          // Brown
    textLight: '#8D6E63',     // Light Brown
    rainbow: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#A594F9', '#FF6AC1'],
  },
  
  typography: {
    heading: '"Fredoka One", cursive',
    body: '"Nunito", sans-serif',
    accent: '"Caveat", cursive',
  },
  
  // ============================================
  // FEATURES LIST WITH DETAILED CONTENT
  // ============================================
  features: [
    {
      name: 'Animated Character Avatars',
      emoji: '🎨',
      shortDescription: 'Custom cartoon versions of you two!',
      detailedContent: {
        title: 'Your Personal Cartoon Characters! 🎨',
        description: 'We create fun, animated avatars that look just like you! Choose from different styles and see yourselves as cartoon characters.',
        benefits: [
          'Custom illustrated avatars',
          'Multiple style options (chibi, comic, realistic)',
          'Animated expressions and poses',
          'Perfect for social media',
          'High-resolution downloads included',
        ],
        samples: [
          {
            style: 'Chibi Style',
            preview: 'https://images.unsplash.com/photo-1618004652321-13a63e576b80?w=400&q=80',
            video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            description: 'Super cute, big-headed cartoon style',
          },
          {
            style: 'Comic Style',
            preview: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80',
            description: 'Bold lines and vibrant colors',
          },
        ],
        howItWorks: 'Upload your photos, choose a style, and our artists create your avatars in 24-48 hours!',
      },
    },
    {
      name: 'Comic-Style Love Story',
      emoji: '📸',
      shortDescription: 'Your relationship as a comic book!',
      detailedContent: {
        title: 'Love Story Comic Book! 📖',
        description: 'Transform your relationship into an illustrated comic book with speech bubbles, action panels, and superhero-style moments!',
        benefits: [
          'Professional comic illustration',
          '8-12 page digital comic',
          'Speech bubbles with your actual words',
          'Action scenes and romantic moments',
          'Printable PDF version',
        ],
        samples: [
          {
            style: 'First Meeting Panel',
            preview: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80',
            video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            description: 'KA-POW! When our eyes first met...',
          },
          {
            style: 'Adventure Scene',
            preview: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&q=80',
            description: 'Road trip adventures in comic style!',
          },
        ],
        howItWorks: 'Share your favorite relationship moments, and we illustrate them as comic panels with dramatic flair!',
      },
    },
    {
      name: 'Fun Photo Booth with Filters',
      emoji: '🎮',
      shortDescription: 'Create silly photos together!',
      detailedContent: {
        title: 'Virtual Photo Booth! 📸✨',
        description: 'Take fun photos with digital props, filters, and effects. Save memories and share on social media instantly!',
        benefits: [
          '50+ fun filters and effects',
          'Virtual props (hats, glasses, mustaches)',
          'Instant photo saving',
          'Share directly to social media',
          'Create photo strips like a real booth',
        ],
        filters: [
          { name: 'Heart Eyes', emoji: '😍' },
          { name: 'Bunny Ears', emoji: '🐰' },
          { name: 'Sparkle Crown', emoji: '👑' },
          { name: 'Vintage Film', emoji: '🎞️' },
          { name: 'Confetti Party', emoji: '🎉' },
        ],
        howItWorks: 'Use your webcam or upload photos, add filters and props, then save your creations!',
      },
    },
    {
      name: 'Relationship Games & Quizzes',
      emoji: '🎵',
      shortDescription: 'Test how well you know each other!',
      detailedContent: {
        title: 'Couple Games & Quizzes! 🎯',
        description: 'Fun interactive games to test your compatibility, learn new things about each other, and create memories!',
        benefits: [
          'Compatibility quiz with results',
          'Trivia about your relationship',
          'Prediction game for the future',
          '"How Well Do You Know Me?" quiz',
          'Results you can share',
        ],
        games: [
          {
            name: 'Love Compatibility Test',
            description: 'Answer questions and get your compatibility score!',
            emoji: '💕',
            questions: 20,
          },
          {
            name: 'Relationship Trivia',
            description: 'Who said what? When did we first...?',
            emoji: '🧠',
            questions: 15,
          },
          {
            name: 'Future Predictions',
            description: 'Guess what your future together looks like!',
            emoji: '🔮',
            questions: 10,
          },
        ],
        howItWorks: 'Each partner answers separately, then compare results to see how well you know each other!',
      },
    },
    {
      name: 'Meme Gallery',
      emoji: '😂',
      shortDescription: 'Your relationship in memes!',
      detailedContent: {
        title: 'Relationship Meme Gallery! 😂',
        description: 'Custom memes about your relationship! We take your inside jokes and favorite moments and turn them into hilarious, shareable memes.',
        benefits: [
          '10-20 custom memes created',
          'Based on your stories and jokes',
          'Professional meme formats',
          'Shareable on social media',
          'Add new memes anytime',
        ],
        memeCategories: [
          {
            category: 'Expectation vs Reality',
            example: 'Planning a date vs Actually on the date',
            emoji: '😅',
          },
          {
            category: 'Relationship Truths',
            example: 'When they say "I\'m not hungry" but eat your food',
            emoji: '🍟',
          },
          {
            category: 'Inside Jokes',
            example: 'That thing that happened that one time...',
            emoji: '🤪',
          },
        ],
        howItWorks: 'Tell us your funny stories and we create professional meme-format images you can share everywhere!',
      },
    },
    {
      name: 'Inside Jokes Section',
      emoji: '🎯',
      shortDescription: 'All your "you had to be there" moments!',
      detailedContent: {
        title: 'Inside Jokes Database! 🤫',
        description: 'A dedicated section for all those "you had to be there" moments. Document your jokes so you never forget them!',
        benefits: [
          'Organized database of all jokes',
          'Add photos and videos to each joke',
          'Tag by date and location',
          'Search through your jokes',
          'Share specific jokes with friends',
        ],
        features: [
          {
            feature: 'Joke Timeline',
            description: 'See when each inside joke was created',
            icon: '📅',
          },
          {
            feature: 'Reference Counter',
            description: 'Track how many times you\'ve referenced each joke',
            icon: '🔢',
          },
          {
            feature: 'Still Funny Rating',
            description: 'Rate if the joke is still funny over time',
            icon: '⭐',
          },
        ],
        howItWorks: 'Add jokes with context, photos, and the story behind them. Perfect for reminiscing!',
      },
    },
    {
      name: 'Bucket List Together',
      emoji: '🎪',
      shortDescription: 'Dreams you want to accomplish as a couple!',
      detailedContent: {
        title: 'Couple Bucket List! 🪣✨',
        description: 'Track all the adventures, goals, and dreams you want to accomplish together. Check them off as you complete them!',
        benefits: [
          'Unlimited bucket list items',
          'Add photos when you complete items',
          'Priority ranking system',
          'Category organization',
          'Share your progress',
        ],
        categories: [
          { name: 'Travel Adventures', emoji: '✈️', count: 15 },
          { name: 'Food Experiences', emoji: '🍕', count: 8 },
          { name: 'Skills to Learn', emoji: '🎨', count: 6 },
          { name: 'Random Fun', emoji: '🎪', count: 12 },
          { name: 'Life Milestones', emoji: '🏠', count: 10 },
        ],
        howItWorks: 'Add items you want to do together, set priorities, and mark them complete with photos and dates!',
      },
    },
    {
      name: 'Virtual Scratch Cards',
      emoji: '🎁',
      shortDescription: 'Surprise gifts and date ideas!',
      detailedContent: {
        title: 'Love Scratch Cards! 🎫',
        description: 'Digital scratch-off cards with surprise date ideas, love coupons, and sweet messages! Scratch to reveal!',
        benefits: [
          '20+ pre-made scratch cards',
          'Custom cards you can create',
          'Date night ideas',
          'Love coupons (massages, cooking, etc)',
          'Sweet surprise messages',
        ],
        cardTypes: [
          {
            type: 'Date Night Ideas',
            examples: ['Movie marathon', 'Cook together', 'Stargazing'],
            emoji: '🌟',
          },
          {
            type: 'Love Coupons',
            examples: ['One free back massage', 'Breakfast in bed', 'Control the TV'],
            emoji: '🎟️',
          },
          {
            type: 'Sweet Messages',
            examples: ['You make me smile', 'I love your laugh', 'You\'re amazing'],
            emoji: '💌',
          },
        ],
        howItWorks: 'Click and drag to scratch the card and reveal your surprise! New cards unlock weekly!',
      },
    },
    {
      name: 'Love Fortune Teller',
      emoji: '🎲',
      shortDescription: 'What does the future hold for you two?',
      detailedContent: {
        title: 'Interactive Fortune Teller! 🔮',
        description: 'A fun, interactive digital fortune teller (like the paper ones from childhood) with predictions about your relationship!',
        benefits: [
          'Digital origami fortune teller',
          '20+ relationship predictions',
          'Date night suggestions',
          'Compliments and affirmations',
          'Fun activity to do together',
        ],
        fortunes: [
          { category: 'Date Ideas', example: 'Try that new restaurant downtown!', emoji: '🍽️' },
          { category: 'Predictions', example: 'A surprise adventure awaits this weekend!', emoji: '🎉' },
          { category: 'Compliments', example: 'Your smile lights up their world!', emoji: '😊' },
          { category: 'Activities', example: 'Time for a spontaneous road trip!', emoji: '🚗' },
        ],
        howItWorks: 'Pick a color, pick a number, reveal your fortune! Just like the paper version but digital!',
      },
    },
  ],
  
  // ============================================
  // DEMO CONTENT - COUPLE INFO
  // ============================================
  demoContent: {
    couple: {
      name1: 'Jake',
      name2: 'Emma',
      tagline: 'Two Goofballs in Love 🤪❤️',
      photos: {
        hero: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80', // Fun couple photo
        individual1: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', // Guy
        individual2: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', // Girl
        together1: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80', // Playful couple
        together2: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=600&q=80', // Fun moment
      }
    },
    
    // ============================================
    // HERO SECTION
    // ============================================
    hero: {
      greeting: 'Hey Babe! 💕',
      message: 'This is our totally awesome, super fun, absolutely epic love story!',
      subtext: 'Made with love, laughter, and way too many inside jokes',
      date: '2025-02-14T00:00:00',
      backgroundImage: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=1920&q=80',
      confettiEnabled: true,
      animationStyle: 'bouncy', // Options: bouncy, wiggle, spin
    },
    
    // ============================================
    // TIMELINE - COMIC STYLE (EXPANDABLE)
    // ============================================
    timeline: [
      {
        date: '2023-04-01',
        title: 'We Met! 🎉',
        description: 'You laughed at my terrible joke. I knew you were the one.',
        emoji: '😂',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80',
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', // Demo video
        funFact: 'It was actually April Fools\' Day but this was no joke!',
        mood: 'excited',
        expandedStory: `I still remember every detail of that day. I was at the coffee shop, nervously practicing my order in my head (because apparently that's what I do), when you walked in. 

You were wearing that blue jacket and had your hair up in a messy bun, and I literally forgot what I was going to order. When the barista asked me what I wanted, I just blurted out "Whatever she's having!" pointing at you like a complete weirdo.

But instead of thinking I was creepy (which, let's be honest, it kind of was), you laughed. Not a polite laugh, but a real, genuine, throw-your-head-back laugh. And then you said, "Well, I'm getting decaf with oat milk and extra foam, so I hope you're ready for that."

We ended up sitting at the same table because the place was packed, and you told me the worst joke I've ever heard in my life: "Why did the scarecrow win an award? Because he was outstanding in his field!" I laughed way too hard, mostly because of how proud you looked telling it.

Three hours later, we were still there, our coffees long forgotten and cold. The barista had to literally ask us to leave because they were closing. That's when I knew this was something special.

And yes, it was April Fools' Day, but this was the realest thing that ever happened to me.`,
      },
      {
        date: '2023-04-15',
        title: 'First Date Disaster 🍝',
        description: 'I spilled pasta all over myself. You stayed anyway. True love!',
        emoji: '🤦‍♂️',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
        funFact: 'The waiter gave us free dessert out of pity',
        mood: 'embarrassed',
        expandedStory: `Our first official date. I had it all planned out - this fancy Italian restaurant, I was going to be smooth and charming, maybe even impress you with my knowledge of pasta names (I studied, I really did).

But the universe had other plans. 

Everything was going great at first. You looked absolutely stunning, I managed to not say anything too awkward for the first 20 minutes (personal record!), and then the food arrived.

I was trying to twirl the spaghetti on my fork like a sophisticated person, you know, all romantic and stuff. But I twirled a little too enthusiastically, and suddenly there was pasta flying through the air in slow motion. It landed right on my chest, sauce and all, like some kind of Italian food crime scene.

The entire restaurant went quiet. I just sat there, a noodle literally hanging from my shirt, staring at you, waiting for you to make an excuse and leave. 

But you didn't. Instead, you reached across the table, plucked the noodle off my shirt, ate it, and said, "Waste not, want not!" Then you burst out laughing, and I couldn't help but laugh too.

The waiter came over with napkins and, I think out of pity, brought us a free tiramisu. We shared it, and you got some on your nose, and suddenly my disaster didn't seem so bad anymore.

That's when I realized: you weren't just beautiful and funny - you were someone I could be a complete mess around and still feel like everything was okay. And that was worth more than all the smooth, perfect dates in the world.`,
      },
      {
        date: '2023-06-20',
        title: 'Officially Together! 💑',
        description: 'I asked "Wanna be my girlfriend?" You said "Took you long enough!"',
        emoji: '🥰',
        image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80',
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', // Demo video
        funFact: 'We celebrated with pizza and video games',
        mood: 'romantic',
        expandedStory: `We'd been hanging out for two months, and everyone kept asking, "So are you guys together or what?" And I kept chickening out of having The Talk.

That night, we were at your place, playing Mario Kart (and yes, you were totally destroying me - let the record show). During a particularly intense race, I was so focused on not coming in last place that I just... blurted it out.

"Wanna be my girlfriend?"

Just like that. In the middle of Rainbow Road. Possibly the least romantic timing ever.

You didn't even pause the game. You blue-shelled me (which was honestly deserved), overtook me for first place, crossed the finish line, THEN turned to me and said, "Took you long enough!" with the biggest smile I'd ever seen.

"Wait, is that a yes?" I asked, because apparently I needed clarity even when it was super obvious.

"Yes, you dork. I've been your girlfriend for like three weeks already, I was just waiting for you to make it official."

We ordered pizza to celebrate (pepperoni for me, that weird veggie thing you like), and spent the rest of the night playing co-op games instead of competing. It felt like the most perfect, us way to start this officially.

Later, you fell asleep on my shoulder during a cutscene, and I just sat there, controller in one hand, not wanting to move and wake you up. And I remember thinking: "Yeah, this is it. This is my person."`,
      },
      {
        date: '2023-08-10',
        title: 'First Fight (and Makeup) 🥊➡️💏',
        description: 'Argued about pizza toppings. Made up with pizza. Logic!',
        emoji: '🍕',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
        funFact: 'Still can\'t agree on pineapple. Still together.',
        mood: 'silly',
        expandedStory: `Our first real fight. And yes, it was about pizza toppings. I'm not proud of it, but I'm also not apologizing for my strong stance against pineapple on pizza (it's wrong and you know it).

We were ordering dinner, a completely normal Friday night, and I suggested pizza. You said, "Great! Let's get Hawaiian!" And I said, "Absolutely not." And somehow, SOMEHOW, this spiraled into a 45-minute debate about culinary boundaries, the sanctity of Italian cuisine, and whether fruit belongs on savory dishes.

You brought up tomatoes being fruit (touché), I countered with the scientific definition versus culinary definition. You said I was being pretentious, I said you were being a food anarchist. It got heated.

Finally, I said, "Fine! Order whatever you want!" and you said, "Fine! I will!" And we both sat there in angry silence for like... thirty seconds.

Then you said, "This is stupid." And I said, "Yeah, it really is." And we both started laughing because we were literally fighting about PIZZA TOPPINGS.

We ended up ordering two pizzas - one with pineapple for you (wrong, but I love you), one with pepperoni for me (correct, as it should be). And we made a rule: no fight is worth missing dinner over.

That night, you tried my pizza, I tried yours (still gross, sorry), and we agreed to disagree. And honestly? That felt like relationship growth right there. Not every battle needs to be won. Some battles are just about pizza.`,
      },
      {
        date: '2023-10-31',
        title: 'Halloween Couple Costume 🎃',
        description: 'We dressed as Mario and Luigi. Best decision ever!',
        emoji: '👻',
        image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=600&q=80',
        funFact: 'We won "Most Creative" at the party',
        mood: 'playful',
        expandedStory: `Halloween! Our first as an official couple, and we needed to make it count. We spent weeks debating costumes - you wanted to do something cute, I wanted something funny, and somehow we landed on Mario and Luigi.

I called dibs on Mario (obviously, I'm the main character here), which meant you were Luigi. You were NOT happy about being "player two," but you looked adorable in that green mustache.

We went all out - found the overalls at a thrift store, made the hats out of felt and cardboard, even got the white gloves. You drew the mustaches on with eyeliner, and we looked absolutely ridiculous. Perfect.

At the party, everyone kept asking us to pose for photos and do the Mario jump (we did it every time, no complaints). When they announced the costume contest winners, we didn't expect anything. But then they called out "Most Creative" and we WON! 

The prize was a gift card to a pizza place (ironic, given our previous fight), and you said, "See? Even fate knows pineapple pizza is the best!" I rolled my eyes but I was too happy to argue.

On the way home, still in costume, we stopped at a 24-hour convenience store for snacks. The cashier just looked at us and said, "Let me guess, Mario Kart tournament?" And we both said, "Obviously!" even though that made no sense.

That was the night I realized we were that couple - the ones who do couple costumes and aren't embarrassed about it. And honestly? I wouldn't have it any other way.`,
      },
      {
        date: '2023-12-01',
        title: 'Got Matching Onesies 🐻',
        description: 'Peak relationship achievement unlocked',
        emoji: '🎯',
        image: 'https://images.unsplash.com/photo-1576090396341-245289991acb?w=600&q=80',
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Reliable test video
        funFact: 'We wear them every movie night now',
        mood: 'cozy',
        expandedStory: `I never thought I'd be the kind of person to own a onesie, let alone a MATCHING onesie. But then you saw them online - these ridiculous bear onesies with ears on the hood - and your eyes lit up.

"We NEED these," you said, showing me your phone. They looked absolutely absurd. "Please? For me?" you added, doing that thing with your eyes that you KNOW I can't resist.

Two days later, a package arrived. You were more excited about this than I'd seen you about anything. We immediately put them on, and I have to admit... they were incredibly comfortable. Like wearing a cloud that also happens to look like a cartoon bear.

You took about a million photos of us, including several where we're just standing there looking serious in bear onesies, which is objectively hilarious. Then we settled in for a movie night, and I fell asleep halfway through because the onesie was TOO comfortable.

I woke up to you taking a video of me, bear hood still on, drooling slightly on the couch. You said it was "for posterity" but I know it's for blackmail purposes.

Now they're our official movie night uniform. Every Friday night, we put them on, make popcorn, and watch whatever terrible reality TV or action movie we're into that week. They've been washed so many times they're getting fuzzy, but we refuse to replace them. These are OUR onesies.

You were right - we NEEDED these. They're not just cozy clothes, they're like... a symbol of how comfortable we are being completely ridiculous together. And I love that.`,
      },
      {
        date: '2024-02-14',
        title: 'First Valentine\'s Together 💝',
        description: 'Homemade dinner (we ordered takeout), Netflix, and lots of laughs',
        emoji: '😍',
        image: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=600&q=80',
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', // Demo video
        funFact: 'The "homemade" dessert was from the bakery',
        mood: 'sweet',
        expandedStory: `Valentine's Day. The big one. I wanted to do something special - make you a fancy homemade dinner, be all romantic and impressive. I watched like fifteen YouTube cooking videos. I bought ingredients. I had a PLAN.

The plan lasted about 45 minutes into cooking before I nearly set off the smoke alarm burning the garlic bread. You came into the kitchen, surveyed the disaster (flour on the ceiling, somehow?), and just hugged me.

"How do you feel about Thai food?" you asked.

"I love Thai food," I admitted, relieved.

We ordered delivery, set up the table all nice with candles anyway, and ate pad thai out of takeout containers while pretending to be at a fancy restaurant. We even did the thing where you feed each other bites (I almost dropped noodles on your lap, classic me).

After dinner, I pulled out "homemade" dessert - chocolate cake from the bakery down the street, still in its box, which you definitely noticed. You didn't say anything though, just got us forks and we ate it straight from the container while watching terrible rom-coms on Netflix.

At one point, you turned to me and said, "This is perfect." And I said, "Even though I totally failed at cooking?" And you said, "Especially because you tried. And also because takeout."

That's when I knew - you don't need grand gestures or perfect dinners. You just need someone who tries, who laughs when things go wrong, and who's happy eating takeout on the couch with you.

Best Valentine's Day ever, disaster cooking and all.`,
      },
      {
        date: '2024-06-15',
        title: 'Road Trip Adventure 🚗',
        description: 'Got lost for 3 hours. Best mistake ever!',
        emoji: '🗺️',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
        funFact: 'We sang the entire Hamilton soundtrack',
        mood: 'adventurous',
        expandedStory: `Summer road trip! We had it all planned - leave at 8 AM, follow the scenic route, stop at these cute little towns we found on Instagram, arrive at the beach by sunset.

We left at 10 AM (because neither of us are morning people), immediately missed our exit because we were arguing about which playlist to listen to, and ended up on some back road that definitely wasn't on the map.

"I think we're lost," you said, looking at your phone.

"We're not lost, we're just... taking the scenic route!" I insisted, even though I had no idea where we were.

Three hours later, we were DEFINITELY lost. But also? We'd discovered this amazing roadside diner that served the best milkshakes, a random sunflower field where we stopped for photos, and a tiny bookstore where you found a first edition of your favorite book.

At some point, we gave up on being lost and just committed to the adventure. We put on the Hamilton soundtrack and sang EVERY. SINGLE. SONG. My voice was hoarse by "Yorktown." You did all of King George's parts with disturbing enthusiasm.

We never made it to the beach by sunset. We made it at like 10 PM, exhausted and happy, with a car full of random souvenirs and about 300 new photos.

Lying on the beach that night, watching the stars, you said, "We should get lost more often." And I agreed. Some of the best moments aren't planned - they're the accidents, the detours, the three-hour scenic routes that weren't actually scenic until we made them that way.

That's us. Always taking the long way, and loving every minute of it.`,
      },
    ],
    
    // ============================================
    // INSIDE JOKES
    // ============================================
    insideJokes: [
      {
        joke: 'The Chicken Incident',
        explanation: 'We don\'t talk about what happened at the petting zoo... 🐔',
        date: '2023-07-04',
        stillFunny: true,
      },
      {
        joke: '"It\'s Fine"',
        explanation: 'Translation: It\'s definitely not fine, but I love you anyway',
        date: 'Ongoing',
        stillFunny: true,
      },
      {
        joke: 'Tuesday Tradition',
        explanation: 'Taco Tuesday turned into "Try to Finish This Massive Burrito" Tuesday',
        date: 'Every Tuesday',
        stillFunny: true,
      },
      {
        joke: 'The Dance Move',
        explanation: 'That thing you do with your arms when your favorite song comes on. No one else gets it. 💃',
        date: '2023-09-20',
        stillFunny: true,
      },
      {
        joke: 'WiFi Password Drama',
        explanation: 'When you tried to guess my WiFi password and it took 47 attempts',
        date: '2023-04-20',
        stillFunny: true,
      },
    ],
    
    // ============================================
    // BUCKET LIST
    // ============================================
    bucketList: [
      { 
        item: 'Visit all the Disney parks 🏰', 
        completed: false,
        priority: 'high',
        category: 'travel',
      },
      { 
        item: 'Learn to cook together without burning stuff 🔥', 
        completed: false,
        priority: 'medium',
        category: 'skills',
      },
      { 
        item: 'Have a water balloon fight 💧', 
        completed: true,
        completedDate: '2023-07-15',
        category: 'fun',
      },
      { 
        item: 'Build a blanket fort 🏕️', 
        completed: true,
        completedDate: '2023-11-10',
        category: 'fun',
      },
      { 
        item: 'Stay up all night talking 🌙', 
        completed: true,
        completedDate: '2023-05-20',
        category: 'romantic',
      },
      { 
        item: 'Take a spontaneous road trip 🚗', 
        completed: false,
        priority: 'high',
        category: 'travel',
      },
      { 
        item: 'Adopt a pet together 🐶', 
        completed: false,
        priority: 'medium',
        category: 'future',
      },
      { 
        item: 'Win at laser tag 🎯', 
        completed: false,
        priority: 'low',
        category: 'fun',
      },
      { 
        item: 'Watch sunrise on a beach 🌅', 
        completed: false,
        priority: 'high',
        category: 'romantic',
      },
      { 
        item: 'Master making the perfect pancakes 🥞', 
        completed: false,
        priority: 'low',
        category: 'skills',
      },
    ],
    
    // ============================================
    // PHOTO GALLERY
    // ============================================
    gallery: {
      title: 'Our Awesome Moments! 📸',
      description: 'Random pics, silly faces, and everything in between',
      categories: [
        {
          name: 'Silly Faces',
          emoji: '🤪',
          photos: [
            {
              url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
              caption: 'When we tried to be serious but failed',
              date: '2023-05-10',
            },
            {
              url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80',
              caption: 'Photo booth madness!',
              date: '2023-06-15',
            },
          ],
        },
        {
          name: 'Adventures',
          emoji: '🗺️',
          photos: [
            {
              url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
              caption: 'Road trip shenanigans',
              date: '2024-06-15',
            },
            {
              url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
              caption: 'Beach day vibes',
              date: '2023-08-20',
            },
          ],
        },
        {
          name: 'Food Adventures',
          emoji: '🍕',
          photos: [
            {
              url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
              caption: 'Pizza date night',
              date: '2023-08-10',
            },
            {
              url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
              caption: 'That pasta incident...',
              date: '2023-04-15',
            },
          ],
        },
      ],
    },
    
    // ============================================
    // VIDEO MEMORIES
    // ============================================
    videos: {
      title: 'Video Memories! 🎬',
      description: 'Our favorite moments caught on camera',
      items: [
        {
          title: 'Our First Dance',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
          description: 'When we danced like nobody was watching (but everyone was)',
          date: '2023-06-20',
          duration: '0:45',
          category: 'Romance',
        },
        {
          title: 'Road Trip Shenanigans',
          url: '/videos/punjabi_test_1.mp4',
          thumbnail: '/images/videos/thumbnail_punjabi.png',
          description: 'That time we got lost and made the best memories',
          date: '2024-06-15',
          duration: '1:23',
          category: 'Adventure',
        },
        {
          title: 'Cooking Disaster',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80',
          description: 'We tried to cook. The fire alarm disagreed.',
          date: '2024-02-14',
          duration: '0:52',
          category: 'Funny',
        },
        {
          title: 'Beach Day Fun',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
          description: 'Sun, sand, and us being silly',
          date: '2023-08-20',
          duration: '1:15',
          category: 'Adventure',
        },
        {
          title: 'Surprise Birthday',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80',
          description: 'Your face when you walked in was priceless!',
          date: '2023-11-10',
          duration: '0:38',
          category: 'Celebration',
        },
        {
          title: 'Karaoke Night',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80',
          description: 'We absolutely killed it (and not in a good way)',
          date: '2024-03-22',
          duration: '2:05',
          category: 'Funny',
        },
      ],
    },
    
    // ============================================
    // LOVE MESSAGE
    // ============================================
    message: {
      title: 'A Message for My Favorite Weirdo',
      emoji: '💌',
      paragraphs: [
        'Yo Emma! 👋',
        '',
        'Remember when we first met and you thought I was weird? Well, joke\'s on you because now you\'re stuck with me! 😝',
        '',
        'Thanks for:',
        '• Laughing at my dumb jokes (even the really bad ones)',
        '• Being my partner in crime (and pizza)',
        '• Putting up with my terrible singing in the car',
        '• Being as weird as I am',
        '• Making every day feel like an adventure',
        '',
        'You\'re my best friend, my favorite weirdo, and the peanut butter to my jelly.',
        '',
        'Love you to the moon and back! 🚀🌙',
        '',
        'Your Forever Goofball,',
        'Jake',
        '',
        'P.S. - I\'m STILL not sorry about the karaoke incident 🎤😎',
      ],
      backgroundImage: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=1200&q=80',
    },
    
    // ============================================
    // STATS & FUN FACTS
    // ============================================
    stats: [
      {
        label: 'Days Together',
        value: '623',
        emoji: '📅',
        color: '#FF6B6B',
      },
      {
        label: 'Pizza Dates',
        value: '47',
        emoji: '🍕',
        color: '#FFD93D',
      },
      {
        label: 'Inside Jokes',
        value: '∞',
        emoji: '😂',
        color: '#6BCB77',
      },
      {
        label: 'Selfies Taken',
        value: '892',
        emoji: '📸',
        color: '#4D96FF',
      },
      {
        label: 'Songs Shared',
        value: '234',
        emoji: '🎵',
        color: '#A594F9',
      },
      {
        label: 'Movie Nights',
        value: '78',
        emoji: '🎬',
        color: '#FF6AC1',
      },
    ],
    
    // ============================================
    // MUSIC PLAYLIST
    // ============================================
    playlist: {
      title: 'Our Jam Sessions 🎵',
      description: 'Songs that defined us',
      songs: [
        {
          title: 'Shut Up and Dance',
          artist: 'WALK THE MOON',
          reason: 'Our unofficial anthem',
          emoji: '💃',
          spotifyUrl: 'https://open.spotify.com/track/4kbj5MwxO1bq9wjT5g9HaA',
        },
        {
          title: 'Best Day of My Life',
          artist: 'American Authors',
          reason: 'Every day with you!',
          emoji: '☀️',
          spotifyUrl: 'https://open.spotify.com/track/055mJFbAGJc6jWCKqFjjFr',
        },
        {
          title: 'Happy',
          artist: 'Pharrell Williams',
          reason: 'How you make me feel',
          emoji: '😊',
          spotifyUrl: 'https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH',
        },
      ],
    },
    
    // ============================================
    // GAMES & INTERACTIVE
    // ============================================
    games: {
      fortuneTeller: {
        enabled: true,
        options: [
          'Date night at that new taco place!',
          'Movie marathon with snacks!',
          'Spontaneous adventure time!',
          'Cozy night in with board games',
          'Cook something new together',
          'Go for a sunset walk',
          'Dance party in the living room',
          'Try that weird restaurant',
        ],
      },
      bingo: {
        enabled: true,
        squares: [
          'First Kiss 💋',
          'Met the Parents 👨‍👩‍👧',
          'First Fight & Made Up 🤝',
          'Inside Joke Created 😂',
          'Matching Outfits 👕',
          'Adopted a Pet 🐾',
          'Road Trip 🚗',
          'Said "I Love You" ❤️',
          'Holiday Together 🎄',
          'Surprise Gift 🎁',
          'Karaoke Night 🎤',
          'Cooked Together 👨‍🍳',
        ],
      },
      quiz: {
        enabled: true,
        questions: [
          {
            question: 'What\'s their favorite pizza topping?',
            options: ['Pepperoni', 'Mushrooms', 'Pineapple', 'Everything'],
            correctAnswer: 0,
          },
          {
            question: 'What\'s their go-to karaoke song?',
            options: ['Don\'t Stop Believin\'', 'Bohemian Rhapsody', 'I Want It That Way', 'Never Gonna Give You Up'],
            correctAnswer: 2,
          },
        ],
      },
    },
    
    // ============================================
    // SPECIAL FEATURES
    // ============================================
    specialFeatures: {
      scratchCards: [
        {
          id: 1,
          revealed: false,
          content: 'One free back massage! 💆',
          type: 'coupon',
        },
        {
          id: 2,
          revealed: false,
          content: 'Movie night - your pick! 🎬',
          type: 'coupon',
        },
        {
          id: 3,
          revealed: false,
          content: 'I\'ll do the dishes for a week! 🧽',
          type: 'coupon',
        },
      ],
      easterEggs: [
        {
          location: 'header',
          trigger: 'click logo 5 times',
          reward: 'Secret dance animation!',
        },
        {
          location: 'footer',
          trigger: 'hover for 10 seconds',
          reward: 'Hidden message appears!',
        },
      ],
    },
    
    // ============================================
    // FOOTER INFO
    // ============================================
    footer: {
      tagline: 'Made with 💕, laughter, and too much caffeine',
      links: [
        { label: 'Home', url: '#home' },
        { label: 'Our Story', url: '#timeline' },
        { label: 'Photos', url: '#gallery' },
        { label: 'Fun Stuff', url: '#games' },
      ],
      socialMedia: {
        instagram: '@jakeandемma',
        tiktok: '@couplegoals',
      },
    },
  },
} as const;

export type PlayfulLoveTheme = typeof playfulLoveTheme;
