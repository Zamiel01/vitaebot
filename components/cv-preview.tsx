import type { CVData, Template } from "@/types/cv"
import { JamesWatsonTemplate } from "@/components/templates/james-watson"
import { RachelMarshTemplate } from "@/components/templates/rachel-marsh"
import { StevenEdwardTemplate } from "@/components/templates/steven-edward"
import { JeremyTorresTemplate } from "@/components/templates/jeremy-torres"

interface CVPreviewProps {
  cvData: CVData
  template: Template
}

export function CVPreview({ cvData, template }: CVPreviewProps) {
  const renderTemplate = () => {
    switch (template) {
      case "james-watson":
        return <JamesWatsonTemplate cvData={cvData} />
      case "rachel-marsh":
        return <RachelMarshTemplate cvData={cvData} />
      case "steven-edward":
        return <StevenEdwardTemplate cvData={cvData} />
      case "jeremy-torres":
        return <JeremyTorresTemplate cvData={cvData} />
      default:
        return <JamesWatsonTemplate cvData={cvData} />
    }
  }

  return <div className="w-full h-full">{renderTemplate()}</div>
}
