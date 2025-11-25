// app/fonts.ts
import localFont from "next/font/local";

export const akbalthom = localFont({
    src: [
        {
            path: "../fonts/akbalthom-kh-new.ttf",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-akbalthom",
});

export const akbalthomSpecial = localFont({
    src: [
        {
            path: "../fonts/akbalthom.ttf",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-akbalthom",
});

export const moulpali = localFont({
    src: [
        {
            path: "../fonts/moulpali-regular.woff2",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-moulpali",
});

export const sovanphum = localFont({
    src: [
        {
            path: "../fonts/Suwannaphum.ttf",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-sovanphum",
});
