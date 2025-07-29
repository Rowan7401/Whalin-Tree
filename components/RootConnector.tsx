"use client"
import React from "react"

interface RootConnectorProps {
    childCount: number
    nameTag?: string
}

const RootConnector: React.FC<RootConnectorProps> = ({ childCount, nameTag }) => {
    if (childCount === 0) return null

    const rootX = 60
    const shiftX = 60
    const trunkPath = `M${rootX} 0 C${rootX + 2} 3, ${rootX - 2} 25, ${rootX} 12`

    console.log(`RootConnector for ${nameTag}: childCount = ${childCount}`)

    return (
        <svg
            className="svg-root"
            viewBox="50 -17 30 550"
            width="500"
            height="700"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter id="morph-jagged" x="-80" y="-120" width="400" height="400">
                    <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="6" stitchTiles="noStitch" result="turbulence" />
                    <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="10" />
                </filter>
                <radialGradient id="brown-gradient-trunk" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="40%" stopColor="#985610ff" />
                    <stop offset="90%" stopColor="#61350fff" />
                    <stop offset="100%" stopColor="#502a08ff" />
                </radialGradient>
                <filter id="root-shadow" x="-60" y="-60" width="200" height="250">
                    <feDropShadow dx="2.7" dy="2.7" stdDeviation="2" floodColor="#3b2f1b" floodOpacity="0.6" />
                </filter>
            </defs>

            {/* Vertical trunk */}
            <path
                d={trunkPath}
                fill="none"
                stroke="url(#brown-gradient-trunk)"
                strokeWidth={10}
                strokeLinecap="round"
                filter="url(#morph-jagged) url(#root-shadow)"
            />

            {/* Dynamic branches */}
            {childCount === 1 ? (
                // Unique single-child root path
                <path
                    d={`M${shiftX} 20 C${shiftX} 45, 30 40, 25 54`}
                    fill="none"
                    stroke="url(#brown-gradient-trunk)"
                    strokeWidth={8.5}
                    strokeLinecap="round"
                    filter="url(#morph-jagged) url(#root-shadow)"
                />
            ) : (
                Array.from({ length: childCount }).map((_, index) => {
                    const MAX_OFFSET = 180

                    // Evenly spread across [-MAX_OFFSET, MAX_OFFSET]
                    const x = -MAX_OFFSET + (2 * MAX_OFFSET) * (index / (childCount - 1))

                    

                    console.log(`↳ Path ${index + 1} for ${nameTag}: x = ${x}`)

                    return (
                        <path
                            key={index}
                            d={`M${shiftX} 20 C${shiftX} 45, ${x + shiftX} 15, ${x + shiftX + 10} 54`}
                            fill="none"
                            stroke="url(#brown-gradient-trunk)"
                            strokeWidth={8.5}
                            strokeLinecap="round"
                            filter="url(#morph-jagged) url(#root-shadow)"
                        />
                    )
                })
            )}
        </svg>
    )
}

export default RootConnector
