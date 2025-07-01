import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TagData, generateTagSVG } from '@/utils/generateTagSVG';

interface FallingAnimationOptions {
  tags: TagData[];
  triggerElement: string;
  canvasClass: string;
}

class FallingSimulation {
  private tags: TagData[];
  private dpr: number;
  private parentElement: HTMLElement;
  private rectangles: any[] = [];
  private canvas: HTMLCanvasElement | null = null;
  private engine: any = null;
  private render: any = null;
  private runner: any = null;
  private parentWidth: number | null = null;
  private parentHeight: number | null = null;
  private width: number | null = null;
  private height: number | null = null;
  private ground: any = null;
  private leftWall: any = null;
  private rightWall: any = null;
  private resizeObserver: ResizeObserver | null = null;
  private wallThickness: number;
  private resizeThreshold = 600;

  constructor(tags: TagData[], dpr: number, parentElement: HTMLElement) {
    this.tags = tags;
    this.dpr = dpr;
    this.parentElement = parentElement;
    this.wallThickness = 50 * this.dpr;
  }

  init() {
    this._initializeCanvas();
    this._createWalls();
    this._setupMouseControl();
    this._createRectanglesWithDelay();
  }

  createTagRectangle(tagData: TagData) {
    const tagUrl = generateTagSVG(tagData);
    const img = new Image();
    img.src = tagUrl;
    img.onload = () => {
      const { width: imageWidth, height: imageHeight } = img;
      
      const scaleFactor = (window.screen.width > this.resizeThreshold ? 1 : 0.8) * this.dpr;
      const scaledWidth = imageWidth * scaleFactor;
      const scaledHeight = imageHeight * scaleFactor;
      const xScale = scaledWidth / imageWidth;
      const yScale = scaledHeight / imageHeight;
      const randomX = Math.random() * (this.width! - scaledWidth - 2 * this.wallThickness) + this.wallThickness + scaledWidth / 2;

      const rectangle = Matter.Bodies.rectangle(randomX, -scaledHeight, scaledWidth, scaledHeight, {
        angle: 0,
        density: 0.01,
        friction: 0.1,
        frictionAir: 0,
        frictionStatic: 0,
        restitution: 0.3,
        render: {
          sprite: {
            texture: tagUrl,
            xScale: xScale,
            yScale: yScale
          }
        }
      });
      
      this.rectangles.push(rectangle);
      Matter.World.add(this.engine.world, rectangle);
    };
  }

  cleanup() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.engine) {
      Matter.World.clear(this.engine.world, false);
      Matter.Engine.clear(this.engine);
    }

    if (this.render) {
      Matter.Render.stop(this.render);
      this.render.canvas = null;
      this.render.context = null;
      this.render.textures = {};
    }

    if (this.runner) {
      Matter.Runner.stop(this.runner);
      this.runner = null;
    }
  }

  private _initializeCanvas() {
    this._initializeEngineAndRenderer();
    this._resizeCanvas();
  }

  private _resizeCanvas() {
    this.canvas!.style.width = `${this.parentWidth}px`;
    this.canvas!.style.height = `${this.parentHeight}px`;
    this.canvas!.width = this.parentWidth! * this.dpr;
    this.canvas!.height = this.parentHeight! * this.dpr;

    this.width = this.canvas!.width;
    this.height = this.canvas!.height;

    if (this.render) {
      this.render.options.width = this.canvas!.width;
      this.render.options.height = this.canvas!.height;
      Matter.Render.lookAt(this.render, {
        min: { x: 0, y: 0 },
        max: { x: this.width, y: this.height }
      });
    }

    this._updateWalls();
  }

  private _initializeEngineAndRenderer() {
    this.parentWidth = this.parentElement.offsetWidth;
    this.parentHeight = this.parentElement.offsetHeight;

    this.engine = Matter.Engine.create();

    this.render = Matter.Render.create({
      element: this.parentElement,
      engine: this.engine,
      options: {
        background: 'transparent',
        width: this.parentWidth,
        height: this.parentHeight,
        wireframes: false,
      }
    });

    this.canvas = this.render.canvas;

    this.runner = Matter.Runner.create({
      isFixed: true,
    });

    Matter.Render.run(this.render);
    Matter.Runner.run(this.runner, this.engine);
  }

  private _createWalls() {
    this.ground = this._createWall(this.width! / 2, this.height! + this.wallThickness / 2, this.width!, this.wallThickness);
    this.leftWall = this._createWall(-this.wallThickness / 2, this.height! / 2, this.wallThickness, this.height! * 20);
    this.rightWall = this._createWall(this.width! + this.wallThickness / 2, this.height! / 2, this.wallThickness, this.height! * 20);

    Matter.World.add(this.engine.world, [this.ground, this.leftWall, this.rightWall]);
  }

  private _createWall(x: number, y: number, width: number, height: number) {
    return Matter.Bodies.rectangle(x, y, width, height, { 
      isStatic: true, 
      render: { fillStyle: "rgba(255, 255, 255, 0)" } 
    });
  }

  private _updateWalls() {
    if (this.ground && this.leftWall && this.rightWall) {
      Matter.Body.setPosition(this.ground, { x: this.width! / 2, y: this.height! + this.wallThickness / 2 });
      Matter.Body.setPosition(this.leftWall, { x: -this.wallThickness / 2, y: this.height! / 2 });
      Matter.Body.setPosition(this.rightWall, { x: this.width! + this.wallThickness / 2, y: this.height! / 2 });

      Matter.Body.setVertices(this.ground, [
        { x: 0, y: this.height! },
        { x: this.width!, y: this.height! },
        { x: this.width!, y: this.height! + this.wallThickness },
        { x: 0, y: this.height! + this.wallThickness }
      ]);
      Matter.Body.setVertices(this.leftWall, [
        { x: -this.wallThickness, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: this.height! * 20 },
        { x: -this.wallThickness, y: this.height! * 20 }
      ]);
      Matter.Body.setVertices(this.rightWall, [
        { x: this.width!, y: 0 },
        { x: this.width! + this.wallThickness, y: 0 },
        { x: this.width! + this.wallThickness, y: this.height! * 20 },
        { x: this.width!, y: this.height! * 20 }
      ]);
    }
  }

  private _createRectanglesWithDelay() {
    this.tags.forEach((tag, index) => {
      setTimeout(() => this.createTagRectangle(tag), index * 200);
    });
  }

  private _setupMouseControl() {
    if (!this.canvas) return;
    
    const mouse = Matter.Mouse.create(this.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(this.engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Matter.World.add(this.engine.world, mouseConstraint);
    this.render.mouse = mouse;
  }
}

export const useFallingAnimation = (options: FallingAnimationOptions) => {
  const simulationRef = useRef<FallingSimulation | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const init = () => {
      window.requestAnimationFrame(() => {
        const canvas = document.querySelector(`.${options.canvasClass}`) as HTMLElement;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        simulationRef.current = new FallingSimulation(options.tags, dpr, canvas);
        simulationRef.current.init();
      });
    };

    const scrollTriggerElement = document.querySelector(options.triggerElement);
    if (!scrollTriggerElement) return;

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: scrollTriggerElement,
      start: "top top+=40%",
      onEnter: init,
      once: true
    });

    return () => {
      if (simulationRef.current) {
        simulationRef.current.cleanup();
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [options]);

  return { simulation: simulationRef.current };
}; 