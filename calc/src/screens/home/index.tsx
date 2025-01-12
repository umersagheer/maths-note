import { useEffect, useRef, useState } from "react";
import { ColorSwatch, Group } from "@mantine/core";
import axios from "axios";

import { SWATCHES } from "@/constants";
import { Button } from "@/components/ui/button";

type Response = {
  exp: string;
  result: string;
  assign: boolean;
};

type GeneratedResponse = {
  expression: string;
  answer: string;
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#fff");
  const [reset, setReset] = useState(false);
  const [result, setResult] = useState<GeneratedResponse[]>([]);
  const [dicOfVars, setDicOfVars] = useState({});

  useEffect(() => {
    const resetCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    };

    if (reset) {
      resetCanvas();
      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
      }
    }
  }, []);

  const sendData = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const response = await axios({
        method: "POST",
        url: `${import.meta.env.VITE_API_URL}/calculate`,
        data: {
          image: canvas.toDataURL("image/png"),
          dict_of_vars: dicOfVars,
        },
      });

      const res = await response.data;
      console.log("[RES]", res);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = "crosshair";
      canvas.style.backgroundColor = "black";

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
      }
    }
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      setIsDrawing(false);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2 relative z-10 bg-black p-4">
        <Button onClick={() => setReset(true)} variant={"secondary"}>
          RESET
        </Button>
        <Group className=" pl-2">
          {SWATCHES.map((swatch) => (
            <ColorSwatch
              className="cursor-pointer "
              key={swatch}
              color={swatch}
              onClick={() => setColor(swatch)}
            />
          ))}
        </Group>
        <Button onClick={sendData}>Calculate</Button>
      </div>
      <canvas
        ref={canvasRef}
        id="canvas"
        onMouseDown={startDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        className="absolute -z-0 top-0 left-0 w-full h-full "
      />
    </>
  );
}
