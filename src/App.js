import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Navbar from './Navbar';

// Shape of a chat message
// role: 'user' | 'ai'
// text: message content
// timestamp: human-readable string

function App() {
  // Conversation state tracking for simulated AI behavior
  const [conversationStep, setConversationStep] = useState(0); // 0: initial, 1: goal collected, 2: role collected, 3: experience collected, 4: recommendation given
  const [userGoal, setUserGoal] = useState(''); // confidence, leadership, career, programs
  const [userRole, setUserRole] = useState(''); // user's current role/position
  const [userExperience, setUserExperience] = useState(''); // years of experience or level

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: "Hello! I'm your Iron Lady AI Program Guide. I'm here to help you find the perfect program for your journey. What would you like help with today? Are you looking to build confidence, develop leadership skills, advance your career, or explore our programs?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Used to keep the chat scrolled to the latest message
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Function to scroll to chat container (used by Navbar Home link)
  const scrollToChat = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  /**
   * Simulated conversational AI that tracks conversation state and adapts responses.
   * This function analyzes user input based on the current conversation step and
   * generates context-aware responses that guide the user through a structured flow.
   * 
   * Conversation Flow:
   * - Step 0: Initial greeting, ask about goal (confidence, leadership, career, programs)
   * - Step 1: Goal collected, ask about current role
   * - Step 2: Role collected, ask about experience level
   * - Step 3: Experience collected, provide personalized program recommendation
   * - Step 4: Recommendation given, ask about next steps
   * 
   */
  const generateAIResponse = (userMessage, step, goal, role, experience) => {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Step 0: Initial - Detect user's goal
    if (step === 0) {
      // Detect confidence goal
      if (/(confidence|confident|self-esteem|self-doubt|imposter|impostor|nervous|anxious|fear|scared|intimidated|shy|hesitant|self-confidence)/i.test(lowerMessage)) {
        return {
          text: "I understand you're looking to build confidence. That's a powerful first step! Building self-assurance is essential for leadership growth. To recommend the best program for you, could you tell me what your current role or position is?",
          nextStep: 1,
          goal: 'confidence',
          role: '',
          experience: ''
        };
      }
      
      // Detect leadership goal
      if (/(leadership|leader|leading|manage|management|executive|director|ceo|cto|cfo|vp|vice president|team lead|supervisor|lead a team)/i.test(lowerMessage)) {
        return {
          text: "Excellent! Leadership development is at the heart of what we do. Whether you're aspiring to lead or already in a leadership role, I can help you find the right program. What's your current role or position?",
          nextStep: 1,
          goal: 'leadership',
          role: '',
          experience: ''
        };
      }
      
      // Detect career goal
      if (/(career|job|position|role|promotion|advance|advancement|transition|switch|change career|career path|professional growth|professional development|grow my career)/i.test(lowerMessage)) {
        return {
          text: "Career growth is an exciting journey! I'm here to help you navigate it. Iron Lady's programs are designed to accelerate your professional development. To find the best fit, what's your current role or position?",
          nextStep: 1,
          goal: 'career',
          role: '',
          experience: ''
        };
      }
      
      // Detect programs exploration
      if (/(program|programme|programs|programmes|suggest|recommend|recommendation|what program|which program|offer|available|options|explore)/i.test(lowerMessage)) {
        return {
          text: "I'd love to help you explore our programs! We have several tracks designed for different career stages and goals. To give you the best recommendation, what's your current role or position?",
          nextStep: 1,
          goal: 'programs',
          role: '',
          experience: ''
        };
      }
      
      // Greeting - redirect to goal question
      if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/i.test(lowerMessage)) {
        return {
          text: "Hello! I'm thrilled to help you on your leadership journey. What would you like help with today? Are you looking to build confidence, develop leadership skills, advance your career, or explore our programs?",
          nextStep: 0,
          goal: '',
          role: '',
          experience: ''
        };
      }
      
      // Unclear input - guide to goal
      return {
        text: "I'd love to help you find the perfect program! To get started, could you tell me what you're looking for? Are you interested in building confidence, developing leadership skills, advancing your career, or exploring our programs?",
        nextStep: 0,
        goal: '',
        role: '',
        experience: ''
      };
    }

    // Step 1: Goal collected - Collect role
    if (step === 1) {
      // Extract role from user message (look for common role indicators)
      let detectedRole = lowerMessage;
      
      // If user just says a role directly, use it
      if (lowerMessage.length < 50) {
        detectedRole = userMessage; // Keep original capitalization
      }
      
      return {
        text: `Thank you for sharing that you're a ${detectedRole}. That helps me understand your context better. How many years of professional experience do you have? (e.g., "2 years", "5-7 years", "10+ years", or "early career", "mid-career", "senior")`,
        nextStep: 2,
        goal: goal,
        role: detectedRole,
        experience: ''
      };
    }

    // Step 2: Role collected - Collect experience
    if (step === 2) {
      // Extract experience level
      let detectedExperience = lowerMessage;
      
      // Normalize experience descriptions
      if (/(early|entry|junior|just started|beginning|new|recent)/i.test(lowerMessage)) {
        detectedExperience = 'early career';
      } else if (/(mid|middle|intermediate|several years|5|6|7|8|9)/i.test(lowerMessage)) {
        detectedExperience = 'mid-career';
      } else if (/(senior|executive|10\+|10 plus|many years|experienced|veteran)/i.test(lowerMessage)) {
        detectedExperience = 'senior';
      }
      
      return {
        text: generateProgramRecommendation(goal, role, detectedExperience),
        nextStep: 3,
        goal: goal,
        role: role,
        experience: detectedExperience
      };
    }

    // Step 3: Recommendation given - Ask about next steps
    if (step === 3) {
      // Check if user wants more info, wants to explore, or is ready to proceed
      if (/(yes|yeah|sure|okay|ok|interested|want|would like|tell me more|more info|learn more|explore)/i.test(lowerMessage)) {
        return {
          text: "Wonderful! Here are your next steps:\n\n1. **Visit our website** to learn more about the program details and curriculum\n2. **Book a consultation call** to speak with our program advisors\n3. **Check out our demo videos** to see what the program experience is like\n4. **Connect with alumni** to hear success stories\n\nWould you like me to share the direct links, or do you have any other questions about Iron Lady programs?",
          nextStep: 4,
          goal: goal,
          role: role,
          experience: experience
        };
      }
      
      if (/(no|not|maybe|later|think about it|consider)/i.test(lowerMessage)) {
        return {
          text: "No problem at all! Take your time to consider. If you have any questions later or want to explore other programs, I'm here to help. Is there anything else you'd like to know about Iron Lady?",
          nextStep: 4,
          goal: goal,
          role: role,
          experience: experience
        };
      }
      
      // Generic response for step 3
      return {
        text: "I'm here to support you in any way I can. Would you like to know more about the next steps to enroll, or do you have other questions about Iron Lady programs?",
        nextStep: 3,
        goal: goal,
        role: role,
        experience: experience
      };
    }

    // Step 4: Follow-up or restart conversation
    if (step === 4) {
      // Check if user wants to restart or ask about something new
      if (/(new|different|another|other|restart|start over|begin again)/i.test(lowerMessage)) {
        return {
          text: "Of course! I'd be happy to help you explore other options. What would you like help with? Are you looking to build confidence, develop leadership skills, advance your career, or explore different programs?",
          nextStep: 0,
          goal: '',
          role: '',
          experience: ''
        };
      }
      
      // Thank you or goodbye
      if (/(thank|thanks|bye|goodbye|appreciate|grateful)/i.test(lowerMessage)) {
        return {
          text: "You're very welcome! I'm so glad I could help you on your leadership journey. Remember, Iron Lady is here to support you every step of the way. Feel free to come back anytime if you have more questions. Best of luck!",
          nextStep: 4,
          goal: goal,
          role: role,
          experience: experience
        };
      }
      
      // Default response for step 4
      return {
        text: "I'm here to help! Is there anything else you'd like to know about Iron Lady programs, or would you like to explore a different path?",
        nextStep: 4,
        goal: goal,
        role: role,
        experience: experience
      };
    }

    // Fallback (shouldn't reach here)
    return {
      text: "I'd love to help you find the perfect program! What are you looking to achieve? Are you interested in building confidence, developing leadership skills, advancing your career, or exploring our programs?",
      nextStep: 0,
      goal: '',
      role: '',
      experience: ''
    };
  };

  /**
   * Generates a personalized program recommendation based on collected user data.
   * This simulates intelligent program matching based on goal, role, and experience.
   */
  const generateProgramRecommendation = (goal, role, experience) => {
    const expLevel = experience.toLowerCase();
    const goalType = goal.toLowerCase();

    // Confidence-focused recommendations
    if (goalType === 'confidence') {
      if (expLevel.includes('early') || expLevel.match(/\b[0-4]\s*(year|yr)/)) {
        return `Based on your goal to build confidence and your early-career stage, I highly recommend our **Confident Leadership Track**. This program is specifically designed for professionals like you who want to develop self-assurance, overcome imposter syndrome, and build authentic leadership presence. You'll work with experienced mentors and join a supportive community of women on similar journeys.\n\nThis program includes:\n• Confidence-building workshops\n• Public speaking and communication training\n• Mentorship pairing\n• Networking opportunities\n\nWould you like to know more about the next steps to enroll?`;
      } else {
        return `Given your experience and your focus on building confidence, I recommend our **Executive Confidence Program**. This advanced track helps experienced professionals like you overcome self-doubt at senior levels, develop executive presence, and step into leadership roles with greater assurance.\n\nThis program includes:\n• Advanced confidence strategies for leaders\n• Executive communication and presence\n• Peer mentorship circles\n• Strategic career positioning\n\nWould you like to learn more about how to get started?`;
      }
    }

    // Leadership-focused recommendations
    if (goalType === 'leadership') {
      if (expLevel.includes('early') || expLevel.match(/\b[0-4]\s*(year|yr)/)) {
        return `Perfect! For someone in your position looking to develop leadership skills, I recommend our **Emerging Leaders Program**. This track is designed for early-career professionals who are ready to step into leadership roles. You'll learn essential leadership fundamentals, team management, and strategic thinking.\n\nThis program includes:\n• Leadership fundamentals and frameworks\n• Team dynamics and management\n• Strategic decision-making\n• Leadership mentorship\n\nWould you like to explore this program further?`;
      } else if (expLevel.includes('mid') || expLevel.match(/\b[5-9]\s*(year|yr)/)) {
        return `Excellent! For your mid-career stage and leadership goals, I recommend our **Leadership Excellence Program**. This comprehensive track helps you transition from individual contributor to senior leader, covering executive communication, strategic thinking, and organizational leadership.\n\nThis program includes:\n• Advanced leadership strategies\n• Executive communication and influence\n• Strategic planning and execution\n• Executive mentorship circles\n\nWould you like to know more about enrollment?`;
      } else {
        return `Based on your senior experience and leadership development goals, I recommend our **Executive Leadership Mastery Program**. This elite track is designed for senior professionals ready to take on C-suite or board-level roles. You'll refine your leadership style, expand your influence, and build your executive network.\n\nThis program includes:\n• C-suite leadership strategies\n• Board readiness and governance\n• Executive coaching\n• High-level networking and peer circles\n\nWould you like to learn more about this program?`;
      }
    }

    // Career-focused recommendations
    if (goalType === 'career') {
      if (expLevel.includes('early') || expLevel.match(/\b[0-4]\s*(year|yr)/)) {
        return `For your career advancement goals at this stage, I recommend our **Career Acceleration Program - Early Stage**. This program helps you identify your strengths, set clear career goals, and create a strategic plan for advancement. You'll learn negotiation skills, personal branding, and networking strategies.\n\nThis program includes:\n• Career assessment and goal setting\n• Personal branding and LinkedIn optimization\n• Salary negotiation workshops\n• Professional networking strategies\n\nWould you like to explore how this program can accelerate your career?`;
      } else if (expLevel.includes('mid') || expLevel.match(/\b[5-9]\s*(year|yr)/)) {
        return `Perfect timing! For mid-career professionals looking to advance, I recommend our **Career Acceleration Program - Mid-Career**. This track helps you navigate career transitions, position yourself for promotions, and make strategic career moves. Many participants have successfully transitioned into senior roles within 6-12 months.\n\nThis program includes:\n• Strategic career planning\n• Executive positioning and visibility\n• Advanced negotiation and influence\n• Executive search and recruitment strategies\n\nWould you like to know more about how to get started?`;
      } else {
        return `For your senior-level career advancement goals, I recommend our **Executive Career Transition Program**. This program helps experienced professionals navigate executive transitions, board appointments, and strategic career pivots. You'll work with executive coaches and connect with C-suite leaders.\n\nThis program includes:\n• Executive career strategy\n• Board readiness and positioning\n• Executive coaching and advisory\n• C-suite networking and opportunities\n\nWould you like to explore this program?`;
      }
    }

    // Programs exploration - general recommendation
    if (goalType === 'programs') {
      return `Based on your role as ${role} and your ${experience} experience, here are the programs I think would be a great fit:\n\n• **Leadership Excellence Program**: Develop advanced leadership skills and strategic thinking\n• **Confident Leadership Track**: Build self-assurance and executive presence\n• **Career Acceleration Program**: Navigate career transitions and strategic moves\n• **Mentorship Circles**: Connect with accomplished leaders in your field\n\nEach program is designed to support women at different stages. Would you like me to dive deeper into any specific program, or would you prefer to explore based on a particular goal?`;
    }

    // Default recommendation
    return `Based on your goals and background, I recommend exploring our **Leadership Excellence Program**. This comprehensive program helps professionals develop the skills, mindset, and network needed to excel in leadership roles. It's designed for women at various career stages and covers strategic thinking, decision-making, team dynamics, and executive communication.\n\nWould you like to learn more about this program or explore other options?`;
  };

  // Core send function: updates state, shows typing indicator, and adds intelligent AI reply
  // This function implements conversational AI behavior by tracking conversation state
  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: trimmed,
      timestamp,
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking and response generation after a short delay
    setTimeout(() => {
      const aiTimestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Generate context-aware AI response based on conversation state
      // This simulates a conversational AI that tracks context and adapts responses
      const response = generateAIResponse(
        trimmed,
        conversationStep,
        userGoal,
        userRole,
        userExperience
      );

      // Update conversation state based on AI response
      if (response.nextStep !== undefined) {
        setConversationStep(response.nextStep);
      }
      if (response.goal !== undefined && response.goal !== '') {
        setUserGoal(response.goal);
      }
      if (response.role !== undefined && response.role !== '') {
        setUserRole(response.role);
      }
      if (response.experience !== undefined && response.experience !== '') {
        setUserExperience(response.experience);
      }

      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        text: response.text,
        timestamp: aiTimestamp,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000); // 1 second delay for realistic typing indicator
  };

  return (
    <div 
      className="app-root"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/emp.png)`
      }}
    >
      <Navbar scrollToChat={scrollToChat} />
      <div className="chat-container" ref={chatContainerRef} id="home">
        <header className="chat-header">
          <h1 className="chat-title">Iron Lady – AI Program Guide</h1>
          <p className="chat-subtitle">
            Your personal guide to leadership and career programs
          </p>
        </header>

        <main className="chat-main">
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message-row ${
                  message.role === 'user' ? 'align-right' : 'align-left'
                }`}
              >
                <div
                  className={`chat-bubble ${
                    message.role === 'user' ? 'user-bubble' : 'ai-bubble'
                  }`}
                >
                  <p className="chat-text">{message.text}</p>
                  <span className="chat-timestamp">{message.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message-row align-left">
                <div className="chat-bubble ai-bubble typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-label">Iron Lady AI is typing…</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </main>

        <footer className="chat-input-area">
          <div className="chat-input-wrapper">
            <textarea
              className="chat-input"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about programs, career growth, or leadership..."
              rows={1}
            />
            <button
              type="button"
              className="send-button"
              onClick={sendMessage}
              aria-label="Send message"
            >
              <span className="send-icon">➤</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
