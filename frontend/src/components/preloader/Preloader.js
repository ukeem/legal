import React from 'react';

export default function Preloader() {
    return (
        <div className="preloader">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid"
                width="200"
                height="200"
                style={{
                    shapeRendering: 'auto',
                    display: 'block',
                    background: 'transparent',
                }}
            >
                <g>
                    <circle fill="#212121" r="10" cy="50" cx="84">
                        <animate
                            begin="0s"
                            keySplines="0 0.5 0.5 1"
                            values="10;0"
                            keyTimes="0;1"
                            calcMode="spline"
                            dur="0.5s"
                            repeatCount="indefinite"
                            attributeName="r"
                        />
                        <animate
                            begin="0s"
                            values="#212121;#e0e0e0;#9e9e9e;#616161;#212121"
                            keyTimes="0;0.25;0.5;0.75;1"
                            calcMode="discrete"
                            dur="2s"
                            repeatCount="indefinite"
                            attributeName="fill"
                        />
                    </circle>
                    <circle fill="#212121" r="10" cy="50" cx="16">
                        <animate
                            begin="0s"
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                            values="0;0;10;10;10"
                            keyTimes="0;0.25;0.5;0.75;1"
                            calcMode="spline"
                            dur="2s"
                            repeatCount="indefinite"
                            attributeName="r"
                        />
                        <animate
                            begin="0s"
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                            values="16;16;16;50;84"
                            keyTimes="0;0.25;0.5;0.75;1"
                            calcMode="spline"
                            dur="2s"
                            repeatCount="indefinite"
                            attributeName="cx"
                        />
                    </circle>
                    <circle fill="#616161" r="10" cy="50" cx="50">
                        <animate
                            begin="-0.5s"
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                            values="0;0;10;10;10"
                            keyTimes="0;0.25;0.5;0.75;1"
                            calcMode="spline"
                            dur="2s"
                            repeatCount="indefinite"
                            attributeName="r"
                        />
                        <animate
                            begin="-0.5s"
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                            values="16;16;16;50;84"
                            keyTimes="0;0.25;0.5;0.75;1"
                            calcMode="spline"
                            dur="2s"
                            repeatCount="indefinite"
                            attributeName="cx"
                        />
                    </circle>
                    <circle fill="#9e9e9e" r="10" cy="50" cx="84">
                        <animate
                            begin="-1s"
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                            values="0;0;10;10;10"
                            keyTimes="0;0.25;0.5;0.75;1"
                            calcMode="spline"
                            dur="2s"
                            repeatCount="indefinite"
                            attributeName="r"
                        />
                        <animate
                            begin="-1s"
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                            values="16;16;16;50;84"
                            keyTimes="0;0.25;0.5;0.75;1"
                            calcMode="spline"
                            dur="2s"
                            repeatCount="indefinite"
                            attributeName="cx"
                        />
                    </circle>
                    <circle fill="#e0e0e0" r="10" cy="50" cx="16">
                        <animate
                            begin="-1.5s"
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                            values="0;0;10;10;10"
                            keyTimes="0;0.25;0.5;0.75;1"
                            calcMode="spline"
                            dur="2s"
                            repeatCount="indefinite"
                            attributeName="r"
                        />
                        <animate
                            begin="-1.5s"
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                            values="16;16;16;50;84"
                            keyTimes="0;0.25;0.5;0.75;1"
                            calcMode="spline"
                            dur="2s"
                            repeatCount="indefinite"
                            attributeName="cx"
                        />
                    </circle>
                </g>
            </svg>
        </div>
    );
}
