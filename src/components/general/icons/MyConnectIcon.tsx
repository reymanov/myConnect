import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

interface Props {
    size?: number;
    color?: string;
}

export const MyConnectIcon: React.FC<Props> = ({ size = 56, color = '#fff' }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 512 512">
            <G fill={color} transform="matrix(.1 0 0 -.1 0 512)">
                <Path d="M3750 5114c-14-2-56-9-95-15-163-27-363-113-504-220-42-31-309-290-593-575l-518-519h188c213 0 320-15 491-71 57-19 108-34 114-34s167 155 357 344c320 319 350 346 420 380 256 124 543 64 721-150 152-182 179-422 73-645-34-71-60-99-612-651s-580-578-651-612c-229-109-452-82-654 81-116 94-147 108-242 108-65 0-89-5-125-24-44-23-300-266-300-284 0-41 205-264 326-355 133-101 334-188 509-223 91-18 348-18 440 0 177 35 365 118 504 222 117 87 1257 1237 1313 1324 150 230 218 478 204 740-17 319-138 588-370 818-181 180-383 290-626 343-71 15-317 27-370 18z" />
                <Path d="M2120 3485c-8-2-49-9-90-15-151-25-317-92-465-188-87-56-1237-1196-1324-1313C4 1655-62 1232 66 852c99-295 333-566 614-711C962-5 1261-37 1573 46c119 32 294 117 393 193 44 33 312 293 596 578l518 518h-188c-213 0-320 15-491 71-57 19-108 34-114 34s-167-155-357-344c-320-319-350-346-420-380-171-83-343-87-508-10-265 122-403 402-333 676 43 166 27 147 659 780 633 632 614 616 780 659 186 47 373 1 532-132 104-88 140-104 235-104 64 0 89 5 125 24 43 22 300 266 300 285 0 21-98 142-183 228-181 180-382 291-627 344-67 14-332 28-370 19z" />
            </G>
        </Svg>
    );
};