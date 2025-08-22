"use client"

import type { Template } from "@/types/cv"
import { Card, CardContent } from "@/components/ui/card"

interface TemplateSelectorProps {
  selectedTemplate: Template
  onTemplateSelect: (template: Template) => void
}

const templates = [
  {
    id: "james-watson" as Template,
    name: "Professional Blue",
    description: "Classic professional layout with blue sidebar",
    thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-A2bf6BOnqqxSTz1SxaZBFKwOrTGijw.png",
  },
  {
    id: "rachel-marsh" as Template,
    name: "Modern Clean",
    description: "Clean modern design with teal accents",
    thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-UT6vMlGCkJtiVzSoT5OycfeN9DgVH6.png",
  },
  {
    id: "steven-edward" as Template,
    name: "Nature Green",
    description: "Professional layout with green sidebar",
    thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-VstvSyaEzDiVR77KXNpsxL3DYQLXqV.png",
  },
  {
    id: "jeremy-torres" as Template,
    name: "Creative Modern",
    description: "Modern design with circular profile photo",
    thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-fVM5Gp3SkRLMIZXx0CkH3nkHkb95Sl.png",
  },
]

export function TemplateSelector({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h2>
      <div className="space-y-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id
                ? "ring-2 ring-pink-500 border-pink-300"
                : "border-gray-200 hover:border-pink-300"
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <CardContent className="p-4">
              <div className="aspect-[8.5/11] mb-3 overflow-hidden rounded-md bg-gray-100">
                <img
                  src={template.thumbnail || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
              <p className="text-sm text-gray-600">{template.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
