import { useParams } from 'react-router-dom';
import { guides } from '@/data/guides';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Guide() {
  const { id } = useParams();
  const guide = guides.find(g => g.id === id);

  if (!guide) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-purple-200/60">Guide not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{guide.title}</h1>
      <div className="space-y-6">
        <Card>
            {guide.blocks.map((block, index) => (
                <div key={index}>
                <CardHeader>
                <CardTitle>{block.title}</CardTitle>
                </CardHeader>
                <CardContent>
                <div 
                    className="text-purple-200/60" 
                    dangerouslySetInnerHTML={{ __html: block.content }}
                />
                </CardContent>
                </div>
            ))}
        </Card>
      </div>
    </div>
  );
}