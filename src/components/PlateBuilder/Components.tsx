"use client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function Start({ 
    plateNumber, 
    setPlateNumber, 
    roadLegalSpacing, 
    setRoadLegalSpacing, 
    iWantFrontPlate, 
    setIWantFrontPlate, 
    iWantBackPlate, 
    setIWantBackPlate,
    className
}: { 
    plateNumber: string; 
    setPlateNumber: (value: string) => void; 
    roadLegalSpacing: boolean; 
    setRoadLegalSpacing: (value: boolean) => void; 
    iWantFrontPlate: boolean; 
    setIWantFrontPlate: (value: boolean) => void; 
    iWantBackPlate: boolean; 
    setIWantBackPlate: (value: boolean) => void;
    className?:string
}) {
    return (
        <div className={cn("",className)}>
            <h5>Your registration</h5>
            <Input 
                className="bg-white" 
                value={plateNumber} 
                onChange={(e) => setPlateNumber(e.target.value)} 
            />
            <label className="border bg-white/95 px-2 py-1 rounded-sm">
                Formatted as <span className="font-bold">{plateNumber}</span>
            </label>

            <div className=" grid gap-1">
                <label className=" font-semibold">Character Spacing</label>
                <div className="flex items-center gap-2">
                    <Switch 
                        checked={roadLegalSpacing} 
                        onCheckedChange={(value) => setRoadLegalSpacing(value)} 
                    />
                    <label>Use road legal spacing</label>
                   
                </div>
            </div>

            <div className=" grid gap-1">
                <label className=" font-semibold">FrontPlate</label>
                <div className="flex items-center gap-2">
                    <Switch 
                        checked={iWantFrontPlate} 
                        onCheckedChange={(value) => setIWantFrontPlate(value)} 
                    />
                    <label>I want front plate</label>
                   
                </div>
            </div>
            <div className=" grid gap-1">
                <label className=" font-semibold">Back Plate</label>
                <div className="flex items-center gap-2">
                    <Switch 
                        checked={iWantBackPlate} 
                        onCheckedChange={(value) => setIWantBackPlate(value)} 
                    />
                    <label>I want back plate</label>
                   
                </div>
            </div>
        </div>
    );
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStylesByLetterCount, Plate, PlateSize } from "../../../PlateStyles";
import Image from "next/image";
import { Button } from "../ui/button";


interface STYLEProps {
  className?: string;
  frontStyle: Plate;
  rearStyle: Plate;
  setFrontStyle: (style: Plate) => void;
  setRearStyle: (style: Plate) => void;
}

export function STYLE({ className, frontStyle, rearStyle, setFrontStyle, setRearStyle }: STYLEProps) {
  const plateStyles = getStylesByLetterCount(7); // Assuming getStylesByLetterCount is a function that returns plate styles
  const [sameAsFront, setSameAsFront] = useState(true);

  useEffect(()=>{
    if(sameAsFront){
      setRearStyle(frontStyle)
    }
  },[sameAsFront])

  const handleFrontStyleClick = (style: Plate) => {
    setFrontStyle(style); // This will update the state in the parent component
  };

  const handleRearStyleClick = (style: Plate) => {
    setRearStyle(style); // This will update the state in the parent component
  };

  return (
    <Tabs defaultValue="front" className={`flex flex-col overflow-y-scroll items-stretch bg-yellow rounded-sm h-full ${className}`}>
      <TabsList className="grid grid-cols-2 gap-2">
        <TabsTrigger className="text-lg" value="front">
          FRONT <span className="ml-2 font-extralight mt-2 text-base">STYLE</span>
        </TabsTrigger>
        <TabsTrigger className="text-lg" value="back">
          BACK <span className="ml-2 font-extralight mt-2 text-base">STYLE</span>
        </TabsTrigger>
      </TabsList>

      {/* Front Style Tab */}
      <TabsContent value="front" className="flex flex-col gap-3 col-span-2 px-2 rounded-sm">
        {plateStyles.map((p: Plate) => (
          <div
            className={` pb-2 rounded-sm  pt-[2px] px-[2px] ${frontStyle.name === p.name ? "bg-black text-white" : "bg-white"}`}
            key={p.name}
            onClick={() => handleFrontStyleClick(p)} // Trigger state change for front style
          >
            <div className=" relative h-[140px]"><Image src={"/178348.jpg"} alt="img" className=" rounded-t-sm" fill priority /></div>
            <p className=" h-[60px] px-2 py-2">{p.name}</p>
            
          </div>
        ))}
      </TabsContent>

      {/* Rear Style Tab */}
      <TabsContent value="back" className="flex flex-col gap-3 col-span-2 h-[390px] px-2 rounded-sm">
        <div className="mt-2">
          <Switch className="mr-3" checked={sameAsFront} onCheckedChange={(e) => setSameAsFront(e)} />
          <label>Same as front</label>
        </div>

        {/* Conditionally render rear style options based on sameAsFront */}
        {!sameAsFront && (
          <div className="flex flex-col gap-3 bg-yellow">
            {plateStyles.map((p: Plate) => (
              <div
                className={`min-h-[200px] pt-[2px] pb-3 rounded-sm px-[2px] ${rearStyle.name === p.name ? "bg-black text-white" : "bg-white"}`}
                key={p.name}
                onClick={() => handleRearStyleClick(p)} // Trigger state change for rear style
              >
                <div className=" relative h-[140px]"><Image src={"/178348.jpg"} className=" rounded-t-sm" alt="img" fill priority /></div>
                <p className="h-[60px]  px-2 py-2">{p.name}</p>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

interface SizingProps{
  className?: string;
  frontStyle:Plate;
  rearStyle:Plate,
  frontSize: PlateSize;
  rearSize: PlateSize;
  setFrontSize: (style: PlateSize) => void;
  setRearSize: (style: PlateSize) => void;
}

export function SIZING({ className, frontSize,rearSize,frontStyle,rearStyle,setFrontSize,setRearSize }: SizingProps) {
  const plateStyles = getStylesByLetterCount(7); // Assuming getStylesByLetterCount is a function that returns plate styles
  const [sameAsFront, setSameAsFront] = useState(true);

  useEffect(()=>{
    if(sameAsFront){
      setRearSize(frontSize)
    }
  },[sameAsFront])

  const handleFrontStyleClick = (style: PlateSize) => {
    setFrontSize(style); // This will update the state in the parent component
  };

  const handleRearStyleClick = (style: PlateSize) => {
    setRearSize(style); // This will update the state in the parent component
  };

  return (
    <Tabs defaultValue="front" className={`flex flex-col overflow-y-scroll items-stretch bg-yellow rounded-sm h-full ${className}`}>
      <TabsList className="grid grid-cols-2 gap-2">
        <TabsTrigger className="text-lg" value="front">
          FRONT <span className="ml-2 font-extralight mt-2 text-base">STYLE</span>
        </TabsTrigger>
        <TabsTrigger className="text-lg" value="back">
          BACK <span className="ml-2 font-extralight mt-2 text-base">STYLE</span>
        </TabsTrigger>
      </TabsList>

      {/* Front Style Tab */}
      <TabsContent value="front" className="flex flex-col gap-3 col-span-2 px-2 rounded-sm">
          <div
            className={` pb-2 rounded-sm  pt-[2px] px-[2px]`}
          >
            <div className=" relative h-[140px]"><Image src={"/178348.jpg"} alt="img" className=" rounded-t-sm" fill priority /></div>
            <p className="px-2 py-2">{frontStyle.name}</p>
            <div className="px-2 flex flex-wrap gap-1">
                  {
                    frontStyle.frontPlate.sizes.map((size)=>(
                      <Button className="" variant={"outline"} key={size.key}>{size.width +"x"+ size.height}</Button>
                    ))
                  }
                </div>
          </div>
      </TabsContent>

      {/* Rear Style Tab */}
      <TabsContent value="back" className="flex flex-col gap-3 col-span-2 h-[390px] px-2 rounded-sm">
        <div className="mt-2">
          <Switch className="mr-3" checked={sameAsFront} onCheckedChange={(e) => setSameAsFront(e)} />
          <label>Same as front</label>
        </div>

        {/* Conditionally render rear style options based on sameAsFront */}
        {!sameAsFront && (
          <div
          className={` pb-2 rounded-sm  pt-[2px] px-[2px]`}
        >
          <div className=" relative h-[140px]"><Image src={"/178348.jpg"} alt="img" className=" rounded-t-sm" fill priority /></div>
          <p className="px-2 py-2">{rearStyle.name}</p>
          <div className="px-2 flex flex-wrap gap-1">
                {
                  rearStyle.rearPlate.sizes.map((size)=>(
                    <Button className=" bg-white"  key={size.key}>{size.width +"x"+ size.height}</Button>
                  ))
                }
              </div>
        </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
