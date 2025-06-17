import React from 'react';
import { Droplets } from 'lucide-react';
import { BeverageCategory } from '@/types';

interface CategoryFilterProps {
  categories: BeverageCategory[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={() => onCategoryChange('all')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full font-medium
          transition-all duration-200 hover:scale-105 hover:shadow-md
          ${selectedCategory === 'all'
            ? 'bg-orange-500 text-white shadow-lg' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
        `}
      >
        <Droplets size={18} />
        <span>Todas</span>
      </button>

      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full font-medium
              transition-all duration-200 hover:scale-105 hover:shadow-md
              ${isSelected 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }
            `}
          >
            <span>{category.name}</span>
          </button>
        );
      })}
    </div>
  );
};