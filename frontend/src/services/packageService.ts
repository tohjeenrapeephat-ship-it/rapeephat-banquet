import { useState, useEffect } from 'react';
import { PackageTier, CourseCategory, DishItem } from '../types/quotation.js';
import { BANQUET_PACKAGES } from '../data/packages.js';
import { imageStore } from './imageStore.js';

const STORAGE_KEY = 'rapeephat_custom_packages';
const EVENT_NAME = 'rapeephat_packages_updated';

class PackageService {
  private cache: PackageTier[] | null = null;
  private listeners: Set<(packages: PackageTier[]) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      // Handle multi-tab cross sync
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.cache = this.loadFromStorage();
          this.notifyListeners();
        }
      });
    }
  }

  private loadFromStorage(): PackageTier[] {
    if (typeof window === 'undefined') return BANQUET_PACKAGES;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((pkg: PackageTier) => {
            const defaultPkg = BANQUET_PACKAGES.find((p) => p.id === pkg.id);
            return {
              ...pkg,
              courses: pkg.courses.map((c) => {
                // Auto-upgrade legacy c2 if it still has old single merged string
                let options = c.options;
                if (
                  c.id === 'c2' &&
                  options.length === 1 &&
                  options[0].name.includes('ติ่มซำ / ออเดิร์ฟ')
                ) {
                  const defaultCourse = defaultPkg?.courses.find((dc) => dc.id === 'c2');
                  if (defaultCourse && defaultCourse.options.length > 1) {
                    options = defaultCourse.options;
                  }
                }

                return {
                  ...c,
                  options: options.map((opt) => {
                    const override = imageStore.getOverride(opt.name) || imageStore.getOverride(opt.id);
                    return {
                      ...opt,
                      imageUrl: override || (opt.imageUrl?.startsWith('override:') ? '' : opt.imageUrl)
                    };
                  })
                };
              })
            };
          });
        }
      }
    } catch (e) {
      console.warn('Error loading custom packages from storage:', e);
    }
    return BANQUET_PACKAGES;
  }

  private notifyListeners() {
    const packages = this.getPackages();
    this.listeners.forEach((callback) => {
      try {
        callback(packages);
      } catch (err) {
        console.error('Error executing package listener:', err);
      }
    });
  }

  private broadcast() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    }
  }

  /**
   * Get all active banquet packages (customized or default)
   */
  public getPackages(): PackageTier[] {
    if (!this.cache) {
      this.cache = this.loadFromStorage();
    }
    return this.cache;
  }

  /**
   * Find a package by its ID
   */
  public getPackageById(id: string): PackageTier | undefined {
    return this.getPackages().find((p) => p.id === id);
  }

  /**
   * Save complete list of packages with reliable quota management and imageStore sync
   */
  public savePackages(packages: PackageTier[]): void {
    this.cache = packages;

    // 1. Sync all custom image overrides to high-capacity imageStore
    packages.forEach((pkg) => {
      pkg.courses.forEach((course) => {
        course.options.forEach((opt) => {
          if (opt.imageUrl && opt.imageUrl.trim() !== '' && !opt.imageUrl.startsWith('override:')) {
            imageStore.setOverride(opt.name, opt.imageUrl);
            if (opt.id) {
              imageStore.setOverride(opt.id, opt.imageUrl);
            }
          }
        });
      });
    });

    // 2. Persist packages safely to localStorage
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
      }
    } catch (e) {
      console.warn('LocalStorage payload notice, using slim storage fallback:', e);
      try {
        const slimPackages = packages.map((pkg) => ({
          ...pkg,
          courses: pkg.courses.map((c) => ({
            ...c,
            options: c.options.map((opt) => ({
              ...opt,
              imageUrl: opt.imageUrl?.startsWith('data:') && opt.imageUrl.length > 30000
                ? `override:${opt.name}`
                : opt.imageUrl
            }))
          }))
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(slimPackages));
      } catch (err) {
        console.warn('Slim storage fallback error:', err);
      }
    }

    this.broadcast();
    this.notifyListeners();
  }

  /**
   * Update a specific package's top-level info
   */
  public updatePackage(pkgId: string, updatedData: Partial<PackageTier>): void {
    const packages = this.getPackages().map((pkg) => {
      if (pkg.id === pkgId) {
        return { ...pkg, ...updatedData };
      }
      return pkg;
    });
    this.savePackages(packages);
  }

  /**
   * Update a course title or default dish
   */
  public updateCourse(pkgId: string, courseId: string, courseData: Partial<CourseCategory>): void {
    const packages = this.getPackages().map((pkg) => {
      if (pkg.id === pkgId) {
        const courses = pkg.courses.map((c) => {
          if (c.id === courseId) {
            return { ...c, ...courseData };
          }
          return c;
        });
        return { ...pkg, courses };
      }
      return pkg;
    });
    this.savePackages(packages);
  }

  /**
   * Update a specific dish in a specific course
   */
  public updateDish(pkgId: string, courseId: string, dishId: string, dishData: Partial<DishItem>): void {
    const packages = this.getPackages().map((pkg) => {
      if (pkg.id === pkgId) {
        const courses = pkg.courses.map((c) => {
          if (c.id === courseId) {
            const options = c.options.map((d) => {
              if (d.id === dishId) {
                return { ...d, ...dishData };
              }
              return d;
            });
            return { ...c, options };
          }
          return c;
        });
        return { ...pkg, courses };
      }
      return pkg;
    });
    this.savePackages(packages);
  }

  /**
   * Add a new dish option to a course
   */
  public addDishOption(pkgId: string, courseId: string, newDish: DishItem): void {
    const packages = this.getPackages().map((pkg) => {
      if (pkg.id === pkgId) {
        const courses = pkg.courses.map((c) => {
          if (c.id === courseId) {
            return { ...c, options: [...c.options, newDish] };
          }
          return c;
        });
        return { ...pkg, courses };
      }
      return pkg;
    });
    this.savePackages(packages);
  }

  /**
   * Delete a dish option from a course
   */
  public removeDishOption(pkgId: string, courseId: string, dishId: string): void {
    const packages = this.getPackages().map((pkg) => {
      if (pkg.id === pkgId) {
        const courses = pkg.courses.map((c) => {
          if (c.id === courseId) {
            const options = c.options.filter((d) => d.id !== dishId);
            // If the deleted dish was default, reset default to first option
            let defaultDishId = c.defaultDishId;
            if (defaultDishId === dishId) {
              defaultDishId = options[0]?.id || '';
            }
            return { ...c, options, defaultDishId };
          }
          return c;
        });
        return { ...pkg, courses };
      }
      return pkg;
    });
    this.savePackages(packages);
  }

  /**
   * Reorder dishes within a course
   */
  public reorderDishes(pkgId: string, courseId: string, fromIndex: number, toIndex: number): void {
    const packages = this.getPackages().map((pkg) => {
      if (pkg.id === pkgId) {
        const courses = pkg.courses.map((c) => {
          if (c.id === courseId) {
            const options = [...c.options];
            if (fromIndex < 0 || fromIndex >= options.length || toIndex < 0 || toIndex >= options.length) {
              return c;
            }
            const [moved] = options.splice(fromIndex, 1);
            options.splice(toIndex, 0, moved);
            return { ...c, options };
          }
          return c;
        });
        return { ...pkg, courses };
      }
      return pkg;
    });
    this.savePackages(packages);
  }

  /**
   * Reset all packages back to initial factory defaults from packages.ts
   */
  public resetToDefault(): void {
    this.cache = BANQUET_PACKAGES;
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to reset packages in localStorage:', e);
    }
    this.broadcast();
    this.notifyListeners();
  }

  /**
   * Export packages to JSON string for backup
   */
  public exportPackagesJson(): string {
    return JSON.stringify(this.getPackages(), null, 2);
  }

  /**
   * Import packages from JSON string
   */
  public importPackagesJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id && parsed[0].courses) {
        this.savePackages(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid packages JSON format:', e);
    }
    return false;
  }

  /**
   * Get a customized dish image by dish name if one has been set in any package course option.
   */
  public getCustomDishImage(dishName: string): string | undefined {
    if (!dishName) return undefined;
    const clean = dishName.trim().toLowerCase();
    if (!clean) return undefined;

    // 0. Check high-capacity imageStore direct override
    const directStoreImage = imageStore.getOverride(clean);
    if (directStoreImage) return directStoreImage;

    const pkgs = this.getPackages();
    // 1. Exact match first
    for (const pkg of pkgs) {
      for (const course of pkg.courses) {
        for (const opt of course.options) {
          if (opt.imageUrl && opt.imageUrl.trim() !== '') {
            if (opt.name.trim().toLowerCase() === clean) {
              return opt.imageUrl;
            }
          }
        }
      }
    }

    // 2. Partial match if exact not found
    for (const pkg of pkgs) {
      for (const course of pkg.courses) {
        for (const opt of course.options) {
          if (opt.imageUrl && opt.imageUrl.trim() !== '') {
            const optClean = opt.name.trim().toLowerCase();
            if (optClean.includes(clean) || clean.includes(optClean)) {
              return opt.imageUrl;
            }
          }
        }
      }
    }

    return undefined;
  }

  /**
   * Get map of all custom dish image overrides: { [dishNameLower]: imageUrl }
   */
  public getDishImageOverridesMap(): Record<string, string> {
    const map: Record<string, string> = {};
    const pkgs = this.getPackages();
    for (const pkg of pkgs) {
      for (const course of pkg.courses) {
        for (const opt of course.options) {
          if (opt.imageUrl && opt.imageUrl.trim() !== '') {
            map[opt.name.trim().toLowerCase()] = opt.imageUrl;
          }
        }
      }
    }
    return map;
  }

  /**
   * Subscribe to package updates
   */
  public subscribe(callback: (packages: PackageTier[]) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const packageService = new PackageService();

/**
 * React Hook to access reactive banquet packages
 */
export function useBanquetPackages(): {
  packages: PackageTier[];
  savePackages: (pkgs: PackageTier[]) => void;
  resetToDefault: () => void;
  exportJson: () => string;
  importJson: (json: string) => boolean;
} {
  const [packages, setPackages] = useState<PackageTier[]>(() => packageService.getPackages());

  useEffect(() => {
    // Initial fetch in case of hydration
    setPackages(packageService.getPackages());

    const unsubscribe = packageService.subscribe((updated) => {
      setPackages(updated);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    packages,
    savePackages: (pkgs: PackageTier[]) => packageService.savePackages(pkgs),
    resetToDefault: () => packageService.resetToDefault(),
    exportJson: () => packageService.exportPackagesJson(),
    importJson: (json: string) => packageService.importPackagesJson(json),
  };
}
