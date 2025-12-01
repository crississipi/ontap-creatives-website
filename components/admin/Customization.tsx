import React, { useState, useRef, useEffect } from "react";

interface ElementProperties {
  id: string;
  type: string;
  name: string;
  height: number;
  width: number;
  backgroundColor: string;
  color: string;
  fontSize: number;
  text?: string;
  top: number;
  left: number;
  borderRadius: number;
  opacity: number;
  borderWidth: number;
  borderColor: string;
  borderStyle: string;
  shadow: string;
  padding: string;
  margin: string;
  display: string;
  position: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  zIndex: number;
  overflow: string;
  textAlign: string;
  fontFamily: string;
  fontWeight: string;
  lineHeight: number;
  letterSpacing: number;
  textTransform: string;
  textDecoration: string;
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition: string;
  backgroundRepeat: string;
  transform: string;
  transition: string;
  hoverBackgroundColor: string;
  hoverColor: string;
  hoverBorderColor: string;
  hoverTransform: string;
  hoverShadow: string;
  activeBackgroundColor: string;
  focusBorderColor: string;
  cursor: string;
  boxSizing: string;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}

interface ElementTemplate {
  id: string;
  name: string;
  icon: string;
  type: string;
  defaultProps: Partial<ElementProperties>;
}

interface EditableField {
  id: string;
  property: string;
  value: string | number;
}

// Simple SVG icons - Add props interface
interface IconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

const Icons = {
  Heading: (props: IconProps) => (
    <svg 
      width={props.size || 18} 
      height={props.size || 18} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <path d="M6 4v16M12 4v16M18 4v16M4 8h16M4 16h16" />
    </svg>
  ),
  Type: (props: IconProps) => (
    <svg 
      width={props.size || 18} 
      height={props.size || 18} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <path d="M4 7V4h16v3M9 20h6M12 4v16" />
    </svg>
  ),
  Square: (props: IconProps) => (
    <svg 
      width={props.size || 18} 
      height={props.size || 18} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  ),
  Image: (props: IconProps) => (
    <svg 
      width={props.size || 18} 
      height={props.size || 18} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  Trash: (props: IconProps) => (
    <svg 
      width={props.size || 14} 
      height={props.size || 14} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  ),
  Grid: (props: IconProps) => (
    <svg 
      width={props.size || 18} 
      height={props.size || 18} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
    </svg>
  ),
  Eye: (props: IconProps) => (
    <svg 
      width={props.size || 16} 
      height={props.size || 16} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Save: (props: IconProps) => (
    <svg 
      width={props.size || 16} 
      height={props.size || 16} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <path d="M17 21v-8H7v8M7 3v5h8" />
    </svg>
  ),
  Layers: (props: IconProps) => (
    <svg 
      width={props.size || 16} 
      height={props.size || 16} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  Maximize: (props: IconProps) => (
    <svg 
      width={props.size || 24} 
      height={props.size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
    </svg>
  ),
  Plus: (props: IconProps) => (
    <svg 
      width={props.size || 16} 
      height={props.size || 16} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Minus: (props: IconProps) => (
    <svg 
      width={props.size || 16} 
      height={props.size || 16} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <path d="M5 12h14" />
    </svg>
  ),
  Branch: (props: IconProps) => (
    <svg 
      width={props.size || 20} 
      height={props.size || 20} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <path d="M6 3v12M18 9a3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 013-3 3 3 0 013 3zM6 21a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  ),
  Expand: (props: IconProps) => (
    <svg 
      width={props.size || 12} 
      height={props.size || 12} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <path d="M21 12V7a2 2 0 00-2-2h-5m0 14h5a2 2 0 002-2v-5m-14 0H5a2 2 0 00-2 2v5a2 2 0 002 2h5" />
    </svg>
  ),
  Upload: (props: IconProps) => (
    <svg 
      width={props.size || 16} 
      height={props.size || 16} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  ),
  Transition: (props: IconProps) => (
    <svg 
      width={props.size || 16} 
      height={props.size || 16} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <path d="M1 12s4 8 11 8 11-8 11-8" />
    </svg>
  ),
  Effects: (props: IconProps) => (
    <svg 
      width={props.size || 16} 
      height={props.size || 16} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={props.className}
      style={props.style}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  )
};

const Customization = () => {
  const [scale, setScale] = useState(1);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingElement, setIsDraggingElement] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [activeSection, setActiveSection] = useState<'layout' | 'style' | 'text' | 'background' | 'effects' | 'interactions'>('layout');
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  // Sample elements
  const [elements, setElements] = useState<ElementProperties[]>([
    {
      id: "element-1",
      type: "heading",
      name: "Main Header",
      height: 80,
      width: 400,
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      fontSize: 36,
      text: "Welcome to Advanced Editor",
      top: 100,
      left: 200,
      borderRadius: 12,
      opacity: 1,
      borderWidth: 0,
      borderColor: "#000000",
      borderStyle: "solid",
      shadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
      padding: "20px",
      margin: "0",
      display: "flex",
      position: "absolute",
      zIndex: 1,
      overflow: "visible",
      textAlign: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontWeight: "700",
      lineHeight: 1.2,
      letterSpacing: 0,
      textTransform: "none",
      textDecoration: "none",
      backgroundImage: "",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      transform: "none",
      transition: "all 0.3s ease",
      hoverBackgroundColor: "#2563eb",
      hoverColor: "#ffffff",
      hoverBorderColor: "#3b82f6",
      hoverTransform: "translateY(-2px)",
      hoverShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
      activeBackgroundColor: "#1d4ed8",
      focusBorderColor: "#93c5fd",
      cursor: "pointer",
      boxSizing: "border-box",
      minWidth: 100,
      maxWidth: 800,
      minHeight: 40,
      maxHeight: 500
    },
    {
      id: "element-2",
      type: "box",
      name: "Content Box",
      height: 250,
      width: 500,
      backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#ffffff",
      fontSize: 16,
      text: "This is a gradient box with hover effects. Try hovering over me!",
      top: 220,
      left: 150,
      borderRadius: 20,
      opacity: 1,
      borderWidth: 3,
      borderColor: "#ffffff",
      borderStyle: "solid",
      shadow: "0 20px 40px rgba(102, 126, 234, 0.4)",
      padding: "30px",
      margin: "0",
      display: "flex",
      position: "absolute",
      zIndex: 1,
      overflow: "hidden",
      textAlign: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontWeight: "500",
      lineHeight: 1.6,
      letterSpacing: 0.5,
      textTransform: "none",
      textDecoration: "none",
      backgroundImage: "",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      transform: "none",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      hoverBackgroundColor: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
      hoverColor: "#ffffff",
      hoverBorderColor: "#fbbf24",
      hoverTransform: "scale(1.02)",
      hoverShadow: "0 30px 60px rgba(102, 126, 234, 0.6)",
      activeBackgroundColor: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
      focusBorderColor: "#fbbf24",
      cursor: "pointer",
      boxSizing: "border-box",
      minWidth: 200,
      maxWidth: 1000,
      minHeight: 100,
      maxHeight: 600
    },
    {
      id: "element-3",
      type: "image",
      name: "Image Placeholder",
      height: 300,
      width: 400,
      backgroundColor: "#f3f4f6",
      color: "#6b7280",
      fontSize: 14,
      text: "Click to upload image",
      top: 250,
      left: 650,
      borderRadius: 16,
      opacity: 1,
      borderWidth: 2,
      borderColor: "#d1d5db",
      borderStyle: "dashed",
      shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      margin: "0",
      display: "flex",
      position: "absolute",
      zIndex: 1,
      overflow: "hidden",
      textAlign: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontWeight: "400",
      lineHeight: 1.5,
      letterSpacing: 0,
      textTransform: "none",
      textDecoration: "none",
      backgroundImage: "",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      transform: "none",
      transition: "all 0.3s ease",
      hoverBackgroundColor: "#e5e7eb",
      hoverColor: "#4b5563",
      hoverBorderColor: "#9ca3af",
      hoverTransform: "none",
      hoverShadow: "0 10px 15px rgba(0, 0, 0, 0.15)",
      activeBackgroundColor: "#d1d5db",
      focusBorderColor: "#3b82f6",
      cursor: "pointer",
      boxSizing: "border-box",
      minWidth: 100,
      maxWidth: 1200,
      minHeight: 100,
      maxHeight: 800
    }
  ]);

  // Element templates for left sidebar
  const elementTemplates: ElementTemplate[] = [
    {
      id: "template-heading",
      name: "Heading",
      icon: "H",
      type: "heading",
      defaultProps: {
        type: "heading",
        name: "New Heading",
        width: 400,
        height: 80,
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        fontSize: 36,
        text: "New Heading",
        borderRadius: 12,
        opacity: 1,
        borderWidth: 0,
        borderColor: "#000000",
        borderStyle: "solid",
        shadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        padding: "20px",
        margin: "0",
        display: "flex",
        position: "absolute",
        zIndex: 1,
        overflow: "visible",
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontWeight: "700",
        lineHeight: 1.2,
        letterSpacing: 0,
        textTransform: "none",
        textDecoration: "none",
        backgroundImage: "",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transform: "none",
        transition: "all 0.3s ease",
        hoverBackgroundColor: "#2563eb",
        hoverColor: "#ffffff",
        hoverBorderColor: "#3b82f6",
        hoverTransform: "translateY(-2px)",
        hoverShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
        activeBackgroundColor: "#1d4ed8",
        focusBorderColor: "#93c5fd",
        cursor: "pointer",
        boxSizing: "border-box",
        minWidth: 100,
        maxWidth: 800,
        minHeight: 40,
        maxHeight: 500
      }
    },
    {
      id: "template-text",
      name: "Text",
      icon: "T",
      type: "text",
      defaultProps: {
        type: "text",
        name: "Text Block",
        width: 300,
        height: 150,
        backgroundColor: "transparent",
        color: "#1f2937",
        fontSize: 16,
        text: "Text content goes here...",
        borderRadius: 8,
        opacity: 1,
        borderWidth: 0,
        borderColor: "#000000",
        borderStyle: "solid",
        shadow: "none",
        padding: "16px",
        margin: "0",
        display: "block",
        position: "absolute",
        zIndex: 1,
        overflow: "visible",
        textAlign: "left",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontWeight: "400",
        lineHeight: 1.6,
        letterSpacing: 0,
        textTransform: "none",
        textDecoration: "none",
        backgroundImage: "",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transform: "none",
        transition: "all 0.3s ease",
        hoverBackgroundColor: "transparent",
        hoverColor: "#1f2937",
        hoverBorderColor: "transparent",
        hoverTransform: "none",
        hoverShadow: "none",
        activeBackgroundColor: "transparent",
        focusBorderColor: "transparent",
        cursor: "text",
        boxSizing: "border-box",
        minWidth: 100,
        maxWidth: 600,
        minHeight: 60,
        maxHeight: 400
      }
    },
    {
      id: "template-box",
      name: "Box",
      icon: "□",
      type: "box",
      defaultProps: {
        type: "box",
        name: "Box Container",
        width: 400,
        height: 250,
        backgroundColor: "#ffffff",
        color: "#374151",
        fontSize: 14,
        text: "",
        borderRadius: 16,
        opacity: 1,
        borderWidth: 2,
        borderColor: "#e5e7eb",
        borderStyle: "solid",
        shadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
        padding: "24px",
        margin: "0",
        display: "flex",
        position: "absolute",
        zIndex: 1,
        overflow: "hidden",
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontWeight: "500",
        lineHeight: 1.5,
        letterSpacing: 0,
        textTransform: "none",
        textDecoration: "none",
        backgroundImage: "",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transform: "none",
        transition: "all 0.3s ease",
        hoverBackgroundColor: "#f9fafb",
        hoverColor: "#374151",
        hoverBorderColor: "#d1d5db",
        hoverTransform: "translateY(-2px)",
        hoverShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
        activeBackgroundColor: "#f3f4f6",
        focusBorderColor: "#3b82f6",
        cursor: "pointer",
        boxSizing: "border-box",
        minWidth: 150,
        maxWidth: 800,
        minHeight: 100,
        maxHeight: 500
      }
    },
    {
      id: "template-image",
      name: "Image",
      icon: "🖼️",
      type: "image",
      defaultProps: {
        type: "image",
        name: "Image Placeholder",
        width: 400,
        height: 300,
        backgroundColor: "#f3f4f6",
        color: "#6b7280",
        fontSize: 14,
        text: "Click to upload image",
        borderRadius: 12,
        opacity: 1,
        borderWidth: 2,
        borderColor: "#d1d5db",
        borderStyle: "dashed",
        shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        margin: "0",
        display: "flex",
        position: "absolute",
        zIndex: 1,
        overflow: "hidden",
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontWeight: "400",
        lineHeight: 1.5,
        letterSpacing: 0,
        textTransform: "none",
        textDecoration: "none",
        backgroundImage: "",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transform: "none",
        transition: "all 0.3s ease",
        hoverBackgroundColor: "#e5e7eb",
        hoverColor: "#4b5563",
        hoverBorderColor: "#9ca3af",
        hoverTransform: "none",
        hoverShadow: "0 10px 15px rgba(0, 0, 0, 0.15)",
        activeBackgroundColor: "#d1d5db",
        focusBorderColor: "#3b82f6",
        cursor: "pointer",
        boxSizing: "border-box",
        minWidth: 100,
        maxWidth: 1200,
        minHeight: 100,
        maxHeight: 800
      }
    }
  ];

  const zoomContainerRef = useRef<HTMLDivElement | null>(null);
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const elementDragStartPos = useRef({ x: 0, y: 0 });
  const resizeStartValues = useRef({ 
    width: 0, 
    height: 0, 
    left: 0, 
    top: 0,
    mouseX: 0,
    mouseY: 0 
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedElementData = elements.find(el => el.id === selectedElement);
  const selectedImageUrl = selectedElementData ? imageUrls[selectedElementData.id] : '';

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(true);
      if (e.key === 'Delete' && selectedElement) {
        handleDeleteElement(selectedElement);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedElement]);

  // Handle clicking outside to save edits
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editingField && editInputRef.current && !editInputRef.current.contains(e.target as Node)) {
        saveEdit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingField]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingField && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingField]);

  const handleAddElement = (template: ElementTemplate) => {
    const newId = `element-${Date.now()}`;
    const newElement: ElementProperties = {
      id: newId,
      ...template.defaultProps,
      top: 200,
      left: 400,
    } as ElementProperties;
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newId);
  };

  const handleElementClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedElement(id);
    setEditingField(null);
  };

  const handleCanvasClick = () => {
    setSelectedElement(null);
    setEditingField(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, elementId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrls(prev => ({
            ...prev,
            [elementId]: event.target!.result as string
          }));
          
          // Update element background image
          setElements(prev => prev.map(el => 
            el.id === elementId 
              ? { 
                  ...el, 
                  backgroundImage: `url(${event.target!.result})`,
                  backgroundColor: 'transparent',
                  text: ''
                }
              : el
          ));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = (elementId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = (elementId: string) => {
    setImageUrls(prev => {
      const newUrls = { ...prev };
      delete newUrls[elementId];
      return newUrls;
    });
    
    setElements(prev => prev.map(el => 
      el.id === elementId 
        ? { 
            ...el, 
            backgroundImage: '',
            backgroundColor: '#f3f4f6',
            text: 'Click to upload image'
          }
        : el
    ));
  };

  const startEditing = (id: string, property: string, value: string | number) => {
    setEditingField({ id, property, value });
  };

  const saveEdit = () => {
    if (!editingField || !editInputRef.current) return;

    const newValue = editInputRef.current.value;
    setElements(prev => prev.map(el => {
      if (el.id === editingField.id) {
        const numValue = parseFloat(newValue);
        return {
          ...el,
          [editingField.property]: isNaN(numValue) ? newValue : numValue
        };
      }
      return el;
    }));

    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      setEditingField(null);
    }
  };

  const handleDeleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
    // Remove associated image URL
    setImageUrls(prev => {
      const newUrls = { ...prev };
      delete newUrls[id];
      return newUrls;
    });
  };

  const handleElementDragStart = (e: React.MouseEvent, id: string) => {
    if (isShiftPressed) return; // Shift is for canvas dragging
    
    e.stopPropagation();
    setIsDraggingElement(id);
    const element = elements.find(el => el.id === id);
    if (element) {
      elementDragStartPos.current = {
        x: e.clientX - element.left * scale,
        y: e.clientY - element.top * scale
      };
    }
  };

  const handleElementDrag = (e: React.MouseEvent) => {
    if (!isDraggingElement || isShiftPressed) return;
    
    const element = elements.find(el => el.id === isDraggingElement);
    if (element) {
      const newLeft = Math.round((e.clientX - elementDragStartPos.current.x) / scale);
      const newTop = Math.round((e.clientY - elementDragStartPos.current.y) / scale);
      
      setElements(prev => prev.map(el => 
        el.id === isDraggingElement 
          ? { ...el, left: newLeft, top: newTop }
          : el
      ));
    }
  };

  const handleElementDragEnd = () => {
    setIsDraggingElement(null);
  };

  const handleResizeStart = (e: React.MouseEvent, id: string, direction: string) => {
    e.stopPropagation();
    setIsResizing(id);
    setResizeDirection(direction);
    
    const element = elements.find(el => el.id === id);
    if (element) {
      resizeStartValues.current = {
        width: element.width,
        height: element.height,
        left: element.left,
        top: element.top,
        mouseX: e.clientX,
        mouseY: e.clientY
      };
    }
  };

  const handleResize = (e: React.MouseEvent) => {
    if (!isResizing || !selectedElementData) return;
    
    const deltaX = (e.clientX - resizeStartValues.current.mouseX) / scale;
    const deltaY = (e.clientY - resizeStartValues.current.mouseY) / scale;
    
    let newWidth = resizeStartValues.current.width;
    let newHeight = resizeStartValues.current.height;
    let newLeft = resizeStartValues.current.left;
    let newTop = resizeStartValues.current.top;

    const element = elements.find(el => el.id === isResizing);
    const minSize = 20;
    
    switch (resizeDirection) {
      case 'nw':
        newWidth = Math.max(minSize, Math.min(resizeStartValues.current.width - deltaX, element?.maxWidth || Infinity));
        newHeight = Math.max(minSize, Math.min(resizeStartValues.current.height - deltaY, element?.maxHeight || Infinity));
        newLeft = resizeStartValues.current.left + deltaX;
        newTop = resizeStartValues.current.top + deltaY;
        break;
      case 'ne':
        newWidth = Math.max(minSize, Math.min(resizeStartValues.current.width + deltaX, element?.maxWidth || Infinity));
        newHeight = Math.max(minSize, Math.min(resizeStartValues.current.height - deltaY, element?.maxHeight || Infinity));
        newTop = resizeStartValues.current.top + deltaY;
        break;
      case 'sw':
        newWidth = Math.max(minSize, Math.min(resizeStartValues.current.width - deltaX, element?.maxWidth || Infinity));
        newHeight = Math.max(minSize, Math.min(resizeStartValues.current.height + deltaY, element?.maxHeight || Infinity));
        newLeft = resizeStartValues.current.left + deltaX;
        break;
      case 'se':
        newWidth = Math.max(minSize, Math.min(resizeStartValues.current.width + deltaX, element?.maxWidth || Infinity));
        newHeight = Math.max(minSize, Math.min(resizeStartValues.current.height + deltaY, element?.maxHeight || Infinity));
        break;
      case 'n':
        newHeight = Math.max(minSize, Math.min(resizeStartValues.current.height - deltaY, element?.maxHeight || Infinity));
        newTop = resizeStartValues.current.top + deltaY;
        break;
      case 's':
        newHeight = Math.max(minSize, Math.min(resizeStartValues.current.height + deltaY, element?.maxHeight || Infinity));
        break;
      case 'w':
        newWidth = Math.max(minSize, Math.min(resizeStartValues.current.width - deltaX, element?.maxWidth || Infinity));
        newLeft = resizeStartValues.current.left + deltaX;
        break;
      case 'e':
        newWidth = Math.max(minSize, Math.min(resizeStartValues.current.width + deltaX, element?.maxWidth || Infinity));
        break;
    }
    
    setElements(prev => prev.map(el => 
      el.id === isResizing 
        ? { 
            ...el, 
            width: Math.round(newWidth),
            height: Math.round(newHeight),
            left: Math.round(newLeft),
            top: Math.round(newTop)
          }
        : el
    ));
  };

  const handleResizeEnd = () => {
    setIsResizing(null);
    setResizeDirection('');
  };

  // Add global mouse move listener for smoother resize
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        handleResize(e as unknown as React.MouseEvent);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isResizing) {
        handleResizeEnd();
      }
      if (isDraggingElement) {
        handleElementDragEnd();
      }
      if (isDragging) {
        handleCanvasDragEnd();
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isResizing, isDraggingElement, isDragging, selectedElementData, resizeDirection]);

  // Wheel zoom
  useEffect(() => {
    const container = zoomContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        setScale(prev => Math.min(3, Math.max(0.5, prev + delta)));
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Canvas drag handlers
  const handleCanvasDragStart = (e: React.MouseEvent) => {
    if (!isShiftPressed) return;
    
    setIsDragging(true);
    setOrigin({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleCanvasDrag = (e: React.MouseEvent) => {
    if (isResizing) return;
    
    if (!isDragging || !isShiftPressed) return;
    setOffset({
      x: e.clientX - origin.x,
      y: e.clientY - origin.y,
    });
  };

  const handleCanvasDragEnd = () => {
    setIsDragging(false);
  };

  const zoomIn = () => setScale(prev => Math.min(3, prev + 0.1));
  const zoomOut = () => setScale(prev => Math.max(0.5, prev - 0.1));
  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  // Render editable field
  const renderEditableField = (label: string, property: string, value: string | number, elementId: string, type: string = 'text') => {
    const isEditing = editingField?.id === elementId && editingField?.property === property;

    if (isEditing) {
      if (type === 'select') {
        return (
          <select
            ref={editInputRef as any}
            defaultValue={value.toString()}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1.5 text-sm border border-blue-400 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            onBlur={saveEdit}
          >
            {property === 'display' && (
              <>
                <option value="block">Block</option>
                <option value="flex">Flex</option>
                <option value="inline">Inline</option>
                <option value="inline-block">Inline Block</option>
                <option value="grid">Grid</option>
                <option value="none">None</option>
              </>
            )}
            {property === 'borderStyle' && (
              <>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
                <option value="groove">Groove</option>
                <option value="ridge">Ridge</option>
                <option value="inset">Inset</option>
                <option value="outset">Outset</option>
                <option value="none">None</option>
              </>
            )}
            {property === 'textAlign' && (
              <>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </>
            )}
            {property === 'fontWeight' && (
              <>
                <option value="100">100 (Thin)</option>
                <option value="200">200 (Extra Light)</option>
                <option value="300">300 (Light)</option>
                <option value="400">400 (Normal)</option>
                <option value="500">500 (Medium)</option>
                <option value="600">600 (Semi Bold)</option>
                <option value="700">700 (Bold)</option>
                <option value="800">800 (Extra Bold)</option>
                <option value="900">900 (Black)</option>
              </>
            )}
            {property === 'textTransform' && (
              <>
                <option value="none">None</option>
                <option value="uppercase">Uppercase</option>
                <option value="lowercase">Lowercase</option>
                <option value="capitalize">Capitalize</option>
              </>
            )}
            {property === 'overflow' && (
              <>
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
                <option value="scroll">Scroll</option>
                <option value="auto">Auto</option>
              </>
            )}
            {property === 'position' && (
              <>
                <option value="static">Static</option>
                <option value="relative">Relative</option>
                <option value="absolute">Absolute</option>
                <option value="fixed">Fixed</option>
                <option value="sticky">Sticky</option>
              </>
            )}
            {property === 'cursor' && (
              <>
                <option value="default">Default</option>
                <option value="pointer">Pointer</option>
                <option value="text">Text</option>
                <option value="move">Move</option>
                <option value="grab">Grab</option>
                <option value="grabbing">Grabbing</option>
                <option value="not-allowed">Not Allowed</option>
                <option value="help">Help</option>
                <option value="wait">Wait</option>
                <option value="progress">Progress</option>
              </>
            )}
          </select>
        );
      }

      return (
        <input
          ref={editInputRef}
          type={type === 'color' ? 'color' : 'text'}
          defaultValue={value.toString()}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1.5 text-sm border border-blue-400 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          onBlur={saveEdit}
        />
      );
    }

    return (
      <div
        onClick={() => startEditing(elementId, property, value)}
        className="w-full px-2 py-1.5 text-sm border border-transparent hover:border-gray-300 rounded cursor-text bg-white hover:bg-gray-50 transition-colors"
      >
        {type === 'color' ? (
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: value.toString() }}
            />
            {value}
          </div>
        ) : (
          <>
            {value}
            {typeof value === "number" && ['width', 'height', 'fontSize', 'borderRadius', 'borderWidth', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight', 'zIndex', 'lineHeight', 'letterSpacing'].includes(property) && "px"}
          </>
        )}
      </div>
    );
  };

  // Get cursor style for resize handles
  const getResizeCursor = (direction: string) => {
    switch (direction) {
      case 'n':
      case 's': return 'ns-resize';
      case 'w':
      case 'e': return 'ew-resize';
      case 'nw':
      case 'se': return 'nwse-resize';
      case 'ne':
      case 'sw': return 'nesw-resize';
      default: return 'default';
    }
  };

  // Render section content based on active section
  const renderSectionContent = () => {
    if (!selectedElementData) return null;

    switch (activeSection) {
      case 'layout':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Position</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-gray-500 mb-1">X (left)</div>
                  {renderEditableField("Left", "left", selectedElementData.left, selectedElementData.id)}
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Y (top)</div>
                  {renderEditableField("Top", "top", selectedElementData.top, selectedElementData.id)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Width</label>
                {renderEditableField("Width", "width", selectedElementData.width, selectedElementData.id)}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Height</label>
                {renderEditableField("Height", "height", selectedElementData.height, selectedElementData.id)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Min Width</label>
                {renderEditableField("Min Width", "minWidth", selectedElementData.minWidth, selectedElementData.id)}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Max Width</label>
                {renderEditableField("Max Width", "maxWidth", selectedElementData.maxWidth, selectedElementData.id)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Min Height</label>
                {renderEditableField("Min Height", "minHeight", selectedElementData.minHeight, selectedElementData.id)}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Max Height</label>
                {renderEditableField("Max Height", "maxHeight", selectedElementData.maxHeight, selectedElementData.id)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Padding</label>
                {renderEditableField("Padding", "padding", selectedElementData.padding, selectedElementData.id)}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Margin</label>
                {renderEditableField("Margin", "margin", selectedElementData.margin, selectedElementData.id)}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Display</label>
              {renderEditableField("Display", "display", selectedElementData.display, selectedElementData.id, 'select')}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Position Type</label>
              {renderEditableField("Position", "position", selectedElementData.position, selectedElementData.id, 'select')}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Z-Index</label>
              {renderEditableField("Z-Index", "zIndex", selectedElementData.zIndex, selectedElementData.id)}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Overflow</label>
              {renderEditableField("Overflow", "overflow", selectedElementData.overflow, selectedElementData.id, 'select')}
            </div>
          </div>
        );

      case 'style':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Background Color</label>
              {renderEditableField("Background", "backgroundColor", selectedElementData.backgroundColor, selectedElementData.id, 'color')}
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Text Color</label>
              {renderEditableField("Text Color", "color", selectedElementData.color, selectedElementData.id, 'color')}
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Border Radius</label>
              {renderEditableField("Border Radius", "borderRadius", selectedElementData.borderRadius, selectedElementData.id)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Border Width</label>
                {renderEditableField("Border Width", "borderWidth", selectedElementData.borderWidth, selectedElementData.id)}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Border Color</label>
                {renderEditableField("Border Color", "borderColor", selectedElementData.borderColor, selectedElementData.id, 'color')}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Border Style</label>
              {renderEditableField("Border Style", "borderStyle", selectedElementData.borderStyle, selectedElementData.id, 'select')}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Box Shadow</label>
              {renderEditableField("Shadow", "shadow", selectedElementData.shadow, selectedElementData.id)}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Opacity</label>
              {renderEditableField("Opacity", "opacity", selectedElementData.opacity, selectedElementData.id)}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Transform</label>
              {renderEditableField("Transform", "transform", selectedElementData.transform, selectedElementData.id)}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Cursor</label>
              {renderEditableField("Cursor", "cursor", selectedElementData.cursor, selectedElementData.id, 'select')}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Box Sizing</label>
              <div className="text-sm px-2 py-1.5 bg-gray-100 rounded">
                {selectedElementData.boxSizing}
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Content</label>
              {renderEditableField("Text", "text", selectedElementData.text || "", selectedElementData.id)}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Font Size</label>
                {renderEditableField("Font Size", "fontSize", selectedElementData.fontSize, selectedElementData.id)}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Font Weight</label>
                {renderEditableField("Font Weight", "fontWeight", selectedElementData.fontWeight, selectedElementData.id, 'select')}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Font Family</label>
              {renderEditableField("Font Family", "fontFamily", selectedElementData.fontFamily, selectedElementData.id)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Line Height</label>
                {renderEditableField("Line Height", "lineHeight", selectedElementData.lineHeight, selectedElementData.id)}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Letter Spacing</label>
                {renderEditableField("Letter Spacing", "letterSpacing", selectedElementData.letterSpacing, selectedElementData.id)}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Text Align</label>
              {renderEditableField("Text Align", "textAlign", selectedElementData.textAlign, selectedElementData.id, 'select')}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Text Transform</label>
              {renderEditableField("Text Transform", "textTransform", selectedElementData.textTransform, selectedElementData.id, 'select')}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Text Decoration</label>
              {renderEditableField("Text Decoration", "textDecoration", selectedElementData.textDecoration, selectedElementData.id)}
            </div>
          </div>
        );

      case 'background':
        return (
          <div className="space-y-4">
            {selectedElementData.type === 'image' && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Image Upload</h4>
                {selectedImageUrl ? (
                  <div className="space-y-3">
                    <div className="relative h-40 rounded-lg overflow-hidden">
                      <img 
                        src={selectedImageUrl} 
                        alt="Uploaded" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => triggerImageUpload(selectedElementData.id)}
                        className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      >
                        <Icons.Upload className="inline mr-2" />
                        Change Image
                      </button>
                      <button
                        onClick={() => removeImage(selectedElementData.id)}
                        className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                      >
                        <Icons.Trash className="inline mr-2" />
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => triggerImageUpload(selectedElementData.id)}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <Icons.Upload className="mx-auto mb-2" />
                    <span className="text-sm text-gray-600">Click to upload image</span>
                  </button>
                )}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Background Image URL</label>
              {renderEditableField("Background Image", "backgroundImage", selectedElementData.backgroundImage, selectedElementData.id)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Background Size</label>
                {renderEditableField("Background Size", "backgroundSize", selectedElementData.backgroundSize, selectedElementData.id)}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Background Position</label>
                {renderEditableField("Background Position", "backgroundPosition", selectedElementData.backgroundPosition, selectedElementData.id)}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Background Repeat</label>
              {renderEditableField("Background Repeat", "backgroundRepeat", selectedElementData.backgroundRepeat, selectedElementData.id)}
            </div>
          </div>
        );

      case 'effects':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Transition</label>
              {renderEditableField("Transition", "transition", selectedElementData.transition, selectedElementData.id)}
              <p className="text-xs text-gray-500 mt-1">e.g., "all 0.3s ease"</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Transform</label>
              {renderEditableField("Transform", "transform", selectedElementData.transform, selectedElementData.id)}
              <p className="text-xs text-gray-500 mt-1">e.g., "rotate(10deg) scale(1.1)"</p>
            </div>
          </div>
        );

      case 'interactions':
        return (
          <div className="space-y-4">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Hover Effects</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Hover Background</label>
                  {renderEditableField("Hover Background", "hoverBackgroundColor", selectedElementData.hoverBackgroundColor, selectedElementData.id, 'color')}
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Hover Text Color</label>
                  {renderEditableField("Hover Color", "hoverColor", selectedElementData.hoverColor, selectedElementData.id, 'color')}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Hover Border Color</label>
                  {renderEditableField("Hover Border Color", "hoverBorderColor", selectedElementData.hoverBorderColor, selectedElementData.id, 'color')}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Hover Transform</label>
                  {renderEditableField("Hover Transform", "hoverTransform", selectedElementData.hoverTransform, selectedElementData.id)}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Hover Shadow</label>
                  {renderEditableField("Hover Shadow", "hoverShadow", selectedElementData.hoverShadow, selectedElementData.id)}
                </div>
              </div>
            </div>

            <div className="mb-4 pb-4 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Active State</h4>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Active Background</label>
                {renderEditableField("Active Background", "activeBackgroundColor", selectedElementData.activeBackgroundColor, selectedElementData.id, 'color')}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Focus State</h4>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Focus Border Color</label>
                {renderEditableField("Focus Border Color", "focusBorderColor", selectedElementData.focusBorderColor, selectedElementData.id, 'color')}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col fixed top-0 left-0 z-999 overflow-hidden">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => selectedElementData && handleImageUpload(e, selectedElementData.id)}
      />
      
      {/* Top Toolbar */}
      <div className="w-full border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icons.Branch />
            <h1 className="text-lg font-semibold text-gray-800">Advanced Figma-Like Editor</h1>
            <span className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded">Pro</span>
          </div>
          
          <div className="flex items-center gap-2 ml-8">
            <button 
              onClick={zoomOut}
              className="p-2 hover:bg-gray-100 rounded"
              title="Zoom Out"
            >
              <Icons.Minus />
            </button>
            <span className="text-sm font-medium w-16 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button 
              onClick={zoomIn}
              className="p-2 hover:bg-gray-100 rounded"
              title="Zoom In"
            >
              <Icons.Plus />
            </button>
            <button 
              onClick={resetView}
              className="px-3 py-1 text-sm hover:bg-gray-100 rounded"
            >
              Reset View
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded ${showGrid ? 'bg-gray-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Toggle Grid"
          >
            <Icons.Grid />
          </button>
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            <Icons.Eye />
            <span className="ml-2">Preview</span>
          </button>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Icons.Save />
            <span className="ml-2">Save Changes</span>
          </button>
        </div>
      </div>

      <div className="flex w-full h-full relative">
        {/* Left Sidebar - Element Library */}
        <div className="absolute z-20 w-64 bg-white h-full top-0 left-0 shadow-lg border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Icons.Layers />
              Elements Library
            </h2>
            <p className="text-xs text-gray-500 mt-1">Drag & drop or click to add</p>
          </div>
          
          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {elementTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleAddElement(template)}
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded group-hover:bg-blue-100 text-gray-700">
                    {template.icon === "H" ? <Icons.Heading /> :
                     template.icon === "T" ? <Icons.Type /> :
                     template.icon === "□" ? <Icons.Square /> :
                     template.icon === "🖼️" ? <Icons.Image /> : template.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{template.name}</h3>
                    <p className="text-xs text-gray-500">{template.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Click to add element</p>
              <p>• Shift + Drag to move canvas</p>
              <p>• Drag elements to reposition</p>
              <p>• Drag handles to resize</p>
              <p>• Delete to remove selected</p>
              <p>• Ctrl + Scroll to zoom</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="absolute z-20 w-96 bg-white h-full top-0 right-0 shadow-lg border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700">Properties</h2>
            {selectedElementData && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">{selectedElementData.name}</span>
                <button
                  onClick={() => handleDeleteElement(selectedElementData.id)}
                  className="p-1.5 hover:bg-red-50 text-red-500 rounded"
                  title="Delete element"
                >
                  <Icons.Trash />
                </button>
              </div>
            )}
          </div>
          
          {selectedElementData ? (
            <div className="flex-1 flex flex-col">
              {/* Section Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveSection('layout')}
                    className={`px-4 py-3 text-xs font-medium whitespace-nowrap ${activeSection === 'layout' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Layout
                  </button>
                  <button
                    onClick={() => setActiveSection('style')}
                    className={`px-4 py-3 text-xs font-medium whitespace-nowrap ${activeSection === 'style' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Style
                  </button>
                  <button
                    onClick={() => setActiveSection('text')}
                    className={`px-4 py-3 text-xs font-medium whitespace-nowrap ${activeSection === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Icons.Type className="inline mr-1" />
                    Text
                  </button>
                  <button
                    onClick={() => setActiveSection('background')}
                    className={`px-4 py-3 text-xs font-medium whitespace-nowrap ${activeSection === 'background' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Background
                  </button>
                  <button
                    onClick={() => setActiveSection('effects')}
                    className={`px-4 py-3 text-xs font-medium whitespace-nowrap ${activeSection === 'effects' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Icons.Effects className="inline mr-1" />
                    Effects
                  </button>
                  <button
                    onClick={() => setActiveSection('interactions')}
                    className={`px-4 py-3 text-xs font-medium whitespace-nowrap ${activeSection === 'interactions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Icons.Transition className="inline mr-1" />
                    Interactions
                  </button>
                </div>
              </div>

              {/* Section Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {renderSectionContent()}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Icons.Maximize />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">No element selected</p>
                <p className="text-xs text-gray-500">Select an element from the canvas to edit its properties</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Canvas Area */}
        <div className="w-full h-full overflow-hidden relative" style={{ paddingLeft: '256px', paddingRight: '384px' }}>
          <div
            ref={zoomContainerRef}
            className="w-full h-full"
            onMouseDown={handleCanvasDragStart}
            onMouseMove={handleCanvasDrag}
            onMouseUp={handleCanvasDragEnd}
            onMouseLeave={handleCanvasDragEnd}
          >
            {/* Canvas Container */}
            <div
              className="absolute origin-top-left ease-in-out duration-100"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                cursor: isShiftPressed ? 'grab' : 'default',
              }}
            >
              {/* Canvas */}
              <div 
                className="relative bg-white shadow-lg"
                style={{ 
                  width: '2000px', 
                  height: '2000px',
                  background: showGrid ? 
                    `linear-gradient(90deg, #f8fafc 1px, transparent 1px),
                     linear-gradient(180deg, #f8fafc 1px, transparent 1px),
                     linear-gradient(90deg, #e2e8f0 1px, transparent 1px),
                     linear-gradient(180deg, #e2e8f0 1px, transparent 1px)` : 'white',
                  backgroundSize: '20px 20px, 20px 20px, 100px 100px, 100px 100px'
                }}
                onClick={handleCanvasClick}
              >
                {/* Render Elements */}
                {elements.map((element) => {
                  const elementImageUrl = imageUrls[element.id];
                  const isSelected = selectedElement === element.id;
                  const [isHovered, setIsHovered] = useState(false);

                  return (
                    <div
                      key={element.id}
                      onClick={(e) => handleElementClick(e, element.id)}
                      onMouseDown={(e) => handleElementDragStart(e, element.id)}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      className={`absolute transition-all duration-100 ${isDraggingElement === element.id ? 'cursor-grabbing' : element.cursor}`}
                      style={{
                        top: `${element.top}px`,
                        left: `${element.left}px`,
                        width: `${element.width}px`,
                        height: `${element.height}px`,
                        backgroundColor: element.backgroundColor,
                        backgroundImage: elementImageUrl ? `url(${elementImageUrl})` : element.backgroundImage,
                        backgroundSize: element.backgroundSize,
                        backgroundPosition: element.backgroundPosition,
                        backgroundRepeat: element.backgroundRepeat,
                        color: element.color,
                        fontSize: `${element.fontSize}px`,
                        borderRadius: `${element.borderRadius}px`,
                        opacity: element.opacity,
                        borderWidth: `${element.borderWidth}px`,
                        borderColor: element.borderColor,
                        borderStyle: element.borderStyle,
                        boxShadow: isHovered ? element.hoverShadow : element.shadow,
                        padding: element.padding,
                        margin: element.margin,
                        display: element.display,
                        position: element.position,
                        zIndex: element.zIndex,
                        overflow: element.overflow,
                        textAlign: element.textAlign as any,
                        fontFamily: element.fontFamily,
                        fontWeight: element.fontWeight,
                        lineHeight: element.lineHeight,
                        letterSpacing: `${element.letterSpacing}px`,
                        textTransform: element.textTransform as any,
                        textDecoration: element.textDecoration,
                        transform: isHovered ? element.hoverTransform : element.transform,
                        transition: element.transition,
                        boxSizing: element.boxSizing as any,
                        minWidth: `${element.minWidth}px`,
                        maxWidth: `${element.maxWidth}px`,
                        minHeight: `${element.minHeight}px`,
                        maxHeight: `${element.maxHeight}px`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        wordBreak: 'break-word',
                        outline: isSelected ? '2px solid #3b82f6' : 'none',
                        outlineOffset: '2px',
                        ...(isHovered && {
                          backgroundColor: element.hoverBackgroundColor,
                          color: element.hoverColor,
                          borderColor: element.hoverBorderColor
                        })
                      }}
                    >
                      {element.type === 'image' && !elementImageUrl && !element.backgroundImage ? (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <Icons.Image size={32} className="text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-600">{element.text}</span>
                          <p className="text-xs text-gray-500 mt-2">Click to upload image</p>
                        </div>
                      ) : (
                        <div className="w-full h-full overflow-auto">
                          {element.text && <div style={{ 
                            fontFamily: element.fontFamily,
                            fontWeight: element.fontWeight,
                            lineHeight: element.lineHeight,
                            letterSpacing: `${element.letterSpacing}px`,
                            textTransform: element.textTransform as any,
                            textDecoration: element.textDecoration
                          }}>{element.text}</div>}
                        </div>
                      )}
                      
                      {/* Selection handles */}
                      {isSelected && (
                        <>
                          {/* Corner handles */}
                          <div 
                            className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-sm border border-blue-600 cursor-nwse-resize hover:bg-blue-50 z-10"
                            onMouseDown={(e) => handleResizeStart(e, element.id, 'nw')}
                            style={{ cursor: getResizeCursor('nw') }}
                          />
                          <div 
                            className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-sm border border-blue-600 cursor-nesw-resize hover:bg-blue-50 z-10"
                            onMouseDown={(e) => handleResizeStart(e, element.id, 'ne')}
                            style={{ cursor: getResizeCursor('ne') }}
                          />
                          <div 
                            className="absolute -bottom-1 -left-1 w-3 h-3 bg-white rounded-sm border border-blue-600 cursor-nesw-resize hover:bg-blue-50 z-10"
                            onMouseDown={(e) => handleResizeStart(e, element.id, 'sw')}
                            style={{ cursor: getResizeCursor('sw') }}
                          />
                          <div 
                            className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-sm border border-blue-600 cursor-nwse-resize hover:bg-blue-50 z-10"
                            onMouseDown={(e) => handleResizeStart(e, element.id, 'se')}
                            style={{ cursor: getResizeCursor('se') }}
                          />
                          
                          {/* Edge handles */}
                          <div 
                            className="absolute top-1/2 -left-1 w-3 h-8 bg-white rounded-sm border border-blue-600 cursor-ew-resize hover:bg-blue-50 z-10"
                            style={{ 
                              top: 'calc(50% - 16px)',
                              cursor: getResizeCursor('w')
                            }}
                            onMouseDown={(e) => handleResizeStart(e, element.id, 'w')}
                          />
                          <div 
                            className="absolute top-1/2 -right-1 w-3 h-8 bg-white rounded-sm border border-blue-600 cursor-ew-resize hover:bg-blue-50 z-10"
                            style={{ 
                              top: 'calc(50% - 16px)',
                              cursor: getResizeCursor('e')
                            }}
                            onMouseDown={(e) => handleResizeStart(e, element.id, 'e')}
                          />
                          <div 
                            className="absolute -top-1 left-1/2 w-8 h-3 bg-white rounded-sm border border-blue-600 cursor-ns-resize hover:bg-blue-50 z-10"
                            style={{ 
                              left: 'calc(50% - 16px)',
                              cursor: getResizeCursor('n')
                            }}
                            onMouseDown={(e) => handleResizeStart(e, element.id, 'n')}
                          />
                          <div 
                            className="absolute -bottom-1 left-1/2 w-8 h-3 bg-white rounded-sm border border-blue-600 cursor-ns-resize hover:bg-blue-50 z-10"
                            style={{ 
                              left: 'calc(50% - 16px)',
                              cursor: getResizeCursor('s')
                            }}
                            onMouseDown={(e) => handleResizeStart(e, element.id, 's')}
                          />
                          
                          {/* Size indicator */}
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10">
                            {element.width} × {element.height}px
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Canvas Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2">
              <span className="text-xs font-medium text-gray-600 mr-2">
                {isResizing ? 'Resizing Element' : 
                 isShiftPressed ? 'Canvas Move Mode' : 
                 'Element Edit Mode'}
              </span>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="text-xs text-gray-500">
                {isResizing ? 'Drag to resize' :
                 'Shift + Drag to move canvas • Drag handles to resize'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customization;