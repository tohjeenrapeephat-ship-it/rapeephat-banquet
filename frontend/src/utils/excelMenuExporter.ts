/**
 * 📊 Rapeephat Banquet Menu Excel Exporter
 * Exports comprehensive dish menu analysis, duplicates breakdown, and package structures into an Excel (.xlsx) workbook.
 */

import * as XLSX from "xlsx";
import { BANQUET_PACKAGES } from "../data/packages.js";
import { packageService } from "../services/packageService.js";

export interface DishAnalysisItem {
  name: string;
  tag?: string;
  repeatCount: number;
  packageCount: number;
  packagePricesList: string;
  minPrice: number;
  maxPrice: number;
  courseTitlesList: string;
  hasImage: string;
  isDuplicate: boolean;
}

export function generateDishMenuAnalysis() {
  const packages = packageService.getPackages() || BANQUET_PACKAGES;

  const allDishesMap = new Map<string, { name: string; tag: string; appearances: any[] }>();
  const packageBreakdown: any[] = [];

  packages.forEach((pkg) => {
    pkg.courses.forEach((course) => {
      course.options.forEach((dish) => {
        const cleanName = dish.name.trim();
        if (!allDishesMap.has(cleanName)) {
          allDishesMap.set(cleanName, {
            name: cleanName,
            tag: dish.tag || "",
            appearances: [],
          });
        }

        const entry = allDishesMap.get(cleanName)!;
        if (dish.tag && !entry.tag) entry.tag = dish.tag;

        entry.appearances.push({
          pkgId: pkg.id,
          pkgName: pkg.name,
          pkgPrice: pkg.price,
          courseIndex: course.courseIndex || 0,
          courseTitle: course.title,
          dishId: dish.id,
          imageUrl: dish.imageUrl || "",
        });

        packageBreakdown.push({
          pkgPrice: pkg.price,
          pkgName: pkg.name,
          courseIndex: course.courseIndex || 0,
          courseTitle: course.title,
          dishName: cleanName,
          dishTag: dish.tag || "",
          imageUrl: dish.imageUrl || "",
        });
      });
    });
  });

  const dishList: DishAnalysisItem[] = Array.from(allDishesMap.values()).map((d) => {
    const prices = d.appearances.map((a) => a.pkgPrice).sort((a, b) => a - b);
    const uniquePrices = Array.from(new Set(prices));
    const courses = Array.from(new Set(d.appearances.map((a) => a.courseTitle)));
    const hasImage = d.appearances.some((a) => !!a.imageUrl);

    return {
      name: d.name,
      tag: d.tag,
      repeatCount: d.appearances.length,
      packageCount: uniquePrices.length,
      packagePricesList: uniquePrices.map((p) => p.toLocaleString() + ".-").join(", "),
      minPrice: uniquePrices[0],
      maxPrice: uniquePrices[uniquePrices.length - 1],
      courseTitlesList: courses.join(" | "),
      hasImage: hasImage ? "มีรูปภาพ" : "ไม่มีรูป",
      isDuplicate: uniquePrices.length > 1,
    };
  });

  dishList.sort((a, b) => b.packageCount - a.packageCount || a.name.localeCompare(b.name, "th"));

  const duplicatedDishes = dishList.filter((d) => d.isDuplicate);
  const singleDishes = dishList.filter((d) => !d.isDuplicate);

  return {
    totalPackages: packages.length,
    totalUniqueDishes: dishList.length,
    totalMenuItems: packageBreakdown.length,
    duplicatedCount: duplicatedDishes.length,
    singleCount: singleDishes.length,
    dishList,
    duplicatedDishes,
    singleDishes,
    packageBreakdown,
  };
}

export function exportMenuToExcelFile(fileName: string = "รายการเมนูอาหาร_โต๊ะจีนรพีพัฒน์_ครบทุกแพ็กเกจ.xlsx") {
  const analysis = generateDishMenuAnalysis();

  const sheet1Data = [
    ["ลำดับ", "ชื่อเมนูอาหาร", "สถานะการซ้ำ", "จำนวนราคาที่พบ", "รายชื่อราคาแพ็กเกจที่พบ (บาท)", "ลำดับจานที่พบ", "แท็กเมนู", "สถานะรูปภาพ"],
    ...analysis.dishList.map((d, i) => [
      i + 1,
      d.name,
      d.packageCount > 1 ? "ซ้ำกัน (" + d.packageCount + " ราคา)" : "มี 1 ราคา",
      d.packageCount,
      d.packagePricesList,
      d.courseTitlesList,
      d.tag || "-",
      d.hasImage,
    ]),
  ];

  const sheet2Data = [
    ["ลำดับ", "ชื่อเมนูอาหารที่ซ้ำ", "จำนวนราคาที่ซ้ำ", "ช่วงราคา (ต่ำสุด - สูงสุด)", "รายชื่อราคาแพ็กเกจที่พบ (บาท)", "ลำดับจานที่พบ", "สถานะรูปภาพ"],
    ...analysis.duplicatedDishes.map((d, i) => [
      i + 1,
      d.name,
      d.packageCount,
      d.minPrice.toLocaleString() + " - " + d.maxPrice.toLocaleString() + " บาท",
      d.packagePricesList,
      d.courseTitlesList,
      d.hasImage,
    ]),
  ];

  const sheet3Data = [
    ["ลำดับ", "ราคาแพ็กเกจ (บาท)", "ชื่อแพ็กเกจ", "จานที่", "หมวดหมู่จาน", "ชื่อเมนูอาหาร", "แท็กเมนู", "สถานะซ้ำกับราคาอื่น?"],
    ...analysis.packageBreakdown.map((r, i) => {
      const isDup = analysis.duplicatedDishes.some((d) => d.name === r.dishName);
      return [
        i + 1,
        r.pkgPrice,
        r.pkgName,
        r.courseIndex,
        r.courseTitle,
        r.dishName,
        r.dishTag || "-",
        isDup ? "ซ้ำกับราคาอื่น" : "เฉพาะราคานี้",
      ];
    }),
  ];

  const wb = XLSX.utils.book_new();

  const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
  const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);
  const ws3 = XLSX.utils.aoa_to_sheet(sheet3Data);

  ws1["!cols"] = [
    { wch: 6 },
    { wch: 35 },
    { wch: 16 },
    { wch: 14 },
    { wch: 40 },
    { wch: 30 },
    { wch: 15 },
    { wch: 12 },
  ];

  ws2["!cols"] = [
    { wch: 6 },
    { wch: 35 },
    { wch: 14 },
    { wch: 22 },
    { wch: 45 },
    { wch: 30 },
    { wch: 12 },
  ];

  ws3["!cols"] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 22 },
    { wch: 8 },
    { wch: 30 },
    { wch: 35 },
    { wch: 15 },
    { wch: 16 },
  ];

  XLSX.utils.book_append_sheet(wb, ws1, "1.สรุปเมนูทั้งหมดและรายการซ้ำ");
  XLSX.utils.book_append_sheet(wb, ws2, "2.เฉพาะเมนูที่ซ้ำกัน");
  XLSX.utils.book_append_sheet(wb, ws3, "3.โครงสร้างครบทุกแพ็กเกจ");

  XLSX.writeFile(wb, fileName);
}
