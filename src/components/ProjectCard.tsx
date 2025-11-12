import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award } from "lucide-react";

interface ProjectCardProps {
  title: string;
  author: string;
  category: string;
  poaps: number;
  imageUrl: string;
  authorAvatar?: string;
}

export const ProjectCard = ({ title, author, category, poaps, imageUrl, authorAvatar }: ProjectCardProps) => {
  return (
    <Card className="group overflow-hidden border-border hover:shadow-elegant transition-all duration-300 cursor-pointer">
      <div className="aspect-video overflow-hidden bg-muted">
        <img 
          src={imageUrl} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1">{title}</h3>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {category}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={authorAvatar} />
            <AvatarFallback>{author.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{author}</span>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t border-border bg-muted/30">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Award className="h-4 w-4 text-primary" />
          <span>{poaps} POAPs</span>
        </div>
      </CardFooter>
    </Card>
  );
};
