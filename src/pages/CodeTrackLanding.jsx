import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import {
  Code,
  Bot,
  Cpu,
  Users,
  ArrowRight,
  Menu,
  X,
  Star,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const GlobalStyle = createGlobalStyle`
  :root {
    --color-brand-50: #eef2ff;
    --color-brand-100: #e0e7ff;
    --color-brand-200: #c7d2fe;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    
    overflow-x: hidden;
    background: white;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
`;

const Container = styled.div`
  min-height: 100vh;
  background: white;
  position: relative;
  overflow: hidden;
`;

const ParallaxLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const ParallaxElement = styled.div`
  position: absolute;
  background: ${(props) => props.bg || "var(--color-brand-100)"};
  border-radius: ${(props) => (props.shape === "circle" ? "50%" : "20px")};
  transform: translateY(${(props) => props.offset}px)
    translateX(${(props) => props.offsetX || 0}px);
  transition: transform 0.1s ease-out;
  opacity: ${(props) => props.opacity || 0.6};
  border: 2px solid var(--color-brand-200);
  backdrop-filter: blur(5px);
  animation: ${pulse} 4s ease-in-out infinite;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  z-index: 1000;
  transition: all 0.3s ease;
  border-bottom: 1px solid var(--color-brand-200);
  box-shadow: 0 2px 20px rgba(199, 210, 254, 0.2);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #4f46e5;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: ${(props) => (props.isOpen ? "flex" : "none")};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 2rem;
    box-shadow: 0 10px 25px rgba(199, 210, 254, 0.3);
  }
`;

const NavLink = styled.a`
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  transition: color 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #1a202c;
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: #1a202c;

  @media (max-width: 768px) {
    display: block;
  }
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 2rem;
  position: relative;
  background: linear-gradient(135deg, var(--color-brand-50) 0%, white 100%);
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 800px;
  animation: ${fadeInUp} 1s ease-out;
  position: relative;
  z-index: 10;
`;

const HeroTitle = styled.h1`
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #4a5568;
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const CTAButton = styled.button`
  background: #4338ca;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(26, 32, 44, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(26, 32, 44, 0.3);
    background: #c7d2fe;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
`;

const FloatingElement = styled.div`
  position: absolute;
  background: var(--color-brand-100);
  border: 2px solid var(--color-brand-200);
  border-radius: ${(props) => (props.shape === "square" ? "15px" : "50%")};
  animation: ${float} ${(props) => props.duration}s ease-in-out infinite;
  animation-delay: ${(props) => props.delay}s;
  opacity: 0.8;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(199, 210, 254, 0.3);
`;

const FeaturesSection = styled.section`
  padding: 8rem 2rem;
  background: var(--color-brand-50);
  position: relative;
  z-index: 2;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  color: #1a202c;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  color: #718096;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 20px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 2px solid var(--color-brand-200);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(199, 210, 254, 0.4);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-brand-200), #1a202c);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #3730a3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #718096;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  padding: 8rem 2rem;
  background: white;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  max-width: 800px;
  margin: 0 auto;
`;

const StatCard = styled.div`
  background: var(--color-brand-50);
  padding: 3rem 2rem;
  border-radius: 20px;
  transition: transform 0.3s ease;
  border: 2px solid var(--color-brand-200);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(199, 210, 254, 0.3);
  }
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
  font-variant-numeric: tabular-nums;
`;

const StatLabel = styled.div`
  color: #718096;
  font-weight: 500;
  font-size: 1.1rem;
`;

const Footer = styled.footer`
  background: #1a202c;
  color: white;
  padding: 4rem 2rem 2rem;
  text-align: center;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Custom hook for intersection observer
const useIntersectionObserver = (options) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
};

// Animated counter component
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - percentage, 3);
      const currentCount = Math.floor(easeOut * end);

      setCount(currentCount);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, isVisible]);

  return (
    <StatNumber ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </StatNumber>
  );
};

const CodeTrackLanding = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [header, setHeader] = useState(null);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setHeader(localStorage.getItem("token") || "CodeTrack");
  }, []);
  const features = [
    {
      icon: <Users />,
      title: "Profile Tracking",
      description:
        "Track and monitor coding profiles across multiple platforms. Get comprehensive insights into your coding journey and progress over time with detailed analytics.",
    },
    {
      icon: <Bot />,
      title: "AI Chatbot",
      description:
        "Get instant help with coding questions, debugging, and learning new concepts through our intelligent AI assistant that understands your coding context.",
    },
    {
      icon: <Cpu />,
      title: "AI Compiler",
      description:
        "Compile and run your code with AI-powered optimization suggestions, real-time error detection, and performance insights for better code quality.",
    },
  ];

  const stats = [
    { number: 10000, suffix: "+", label: "Active Users" },
    { number: 50000, suffix: "+", label: "Code Compilations" },
    { number: 1000000, suffix: "+", label: "Lines Tracked" },
    { number: 99.9, suffix: "%", label: "Uptime" },
  ];

  return (
    <>
      <GlobalStyle />
      <Container>
        {/* Multiple parallax layers */}
        <ParallaxLayer>
          <ParallaxElement
            style={{ top: "10%", left: "5%", width: "120px", height: "120px" }}
            bg="var(--color-brand-100)"
            shape="circle"
            offset={scrollY * 0.2}
            opacity={0.7}
          />
          <ParallaxElement
            style={{
              top: "20%",
              right: "10%",
              width: "180px",
              height: "180px",
            }}
            bg="var(--color-brand-200)"
            shape="square"
            offset={scrollY * -0.1}
            offsetX={scrollY * 0.05}
            opacity={0.6}
          />
          <ParallaxElement
            style={{ top: "50%", left: "15%", width: "100px", height: "100px" }}
            bg="var(--color-brand-100)"
            shape="circle"
            offset={scrollY * 0.3}
            opacity={0.8}
          />
          <ParallaxElement
            style={{
              top: "70%",
              right: "20%",
              width: "140px",
              height: "140px",
            }}
            bg="var(--color-brand-200)"
            shape="square"
            offset={scrollY * -0.15}
            offsetX={scrollY * -0.03}
            opacity={0.5}
          />
          <ParallaxElement
            style={{ bottom: "20%", left: "8%", width: "80px", height: "80px" }}
            bg="var(--color-brand-100)"
            shape="circle"
            offset={scrollY * 0.4}
            opacity={0.9}
          />
        </ParallaxLayer>

        <Header>
          <Nav>
            <Logo>
              <Code size={24} />
              CodeTrack
            </Logo>

            <NavLinks isOpen={isMenuOpen}>
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#about">About</NavLink>
              <NavLink href="#contact">Contact</NavLink>
              <Link to={header == "CodeTrack" ? "/login" : "/dashboard"}>
                <CTAButton
                  style={{ padding: "0.5rem 1.5rem", fontSize: "0.9rem" }}
                >
                  Get Started
                  <ArrowRight size={16} />
                </CTAButton>
              </Link>
            </NavLinks>

            <MenuToggle onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </MenuToggle>
          </Nav>
        </Header>

        <HeroSection>
          <FloatingElements>
            <FloatingElement
              style={{ top: "15%", left: "10%", width: "80px", height: "80px" }}
              duration={6}
              delay={0}
              shape="circle"
            />
            <FloatingElement
              style={{
                top: "25%",
                right: "15%",
                width: "60px",
                height: "60px",
              }}
              duration={8}
              delay={2}
              shape="square"
            />
            <FloatingElement
              style={{
                bottom: "35%",
                left: "20%",
                width: "100px",
                height: "100px",
              }}
              duration={7}
              delay={4}
              shape="circle"
            />
            <FloatingElement
              style={{
                bottom: "25%",
                right: "10%",
                width: "70px",
                height: "70px",
              }}
              duration={9}
              delay={1}
              shape="square"
            />
            <FloatingElement
              style={{ top: "60%", left: "5%", width: "50px", height: "50px" }}
              duration={5}
              delay={3}
              shape="circle"
            />
            <FloatingElement
              style={{ top: "40%", right: "5%", width: "90px", height: "90px" }}
              duration={10}
              delay={5}
              shape="square"
            />
          </FloatingElements>

          <HeroContent>
            <HeroTitle> STUDENT CODING DASHBOARD</HeroTitle>
            <HeroSubtitle>
              The ultimate platform for developers to track their coding
              journey, get AI assistance, and compile code with intelligent
              insights.
            </HeroSubtitle>
            <Link to={header == "CodeTrack" ? "/login" : "/dashboard"}>
              <CTAButton>
                Start Your Journey
                <ArrowRight size={20} />
              </CTAButton>
            </Link>
          </HeroContent>
        </HeroSection>

        <FeaturesSection id="features">
          <SectionTitle>Powerful Features</SectionTitle>
          <SectionSubtitle>
            Everything you need to enhance your coding experience and track your
            progress
          </SectionSubtitle>

          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesSection>

        <StatsSection>
          <ParallaxLayer>
            <ParallaxElement
              style={{
                top: "10%",
                left: "10%",
                width: "200px",
                height: "200px",
              }}
              bg="var(--color-brand-100)"
              shape="circle"
              offset={scrollY * -0.1}
              opacity={0.4}
            />
            <ParallaxElement
              style={{
                bottom: "10%",
                right: "10%",
                width: "150px",
                height: "150px",
              }}
              bg="var(--color-brand-200)"
              shape="square"
              offset={scrollY * 0.15}
              opacity={0.5}
            />
          </ParallaxLayer>

          <SectionTitle>Trusted by Developers</SectionTitle>
          <SectionSubtitle>
            Join thousands of developers who trust CodeTrack for their coding
            journey
          </SectionSubtitle>

          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard key={index}>
                <AnimatedCounter
                  end={stat.number}
                  suffix={stat.suffix}
                  duration={2500 + index * 200}
                />
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        </StatsSection>

        <Footer>
          <FooterContent>
            <Logo
              style={{
                justifyContent: "center",
                marginBottom: "2rem",
                color: "white",
              }}
            >
              <Code size={24} />
              CodeTrack
            </Logo>
            <p
              style={{
                color: "#a0aec0",
                marginBottom: "1rem",
                fontSize: "1.1rem",
              }}
            >
              Empowering developers to track, learn, and excel in their coding
              journey.
            </p>
            <p style={{ color: "#718096", fontSize: "0.9rem" }}>
              © 2025 CodeTrack. All rights reserved.
            </p>
          </FooterContent>
        </Footer>
      </Container>
    </>
  );
};

export default CodeTrackLanding;
