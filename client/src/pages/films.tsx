import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Search, Star, Clock } from 'lucide-react';
import { UserNav } from '@/components/user-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase, Film } from '@/lib/supabase';

export default function Films() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: films, isLoading } = useQuery<Film[]>({
    queryKey: ['/api/films'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('films')
        .select('*')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredFilms = films?.filter((film) =>
    film.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    film.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <UserNav />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Films</h1>
          <p className="text-muted-foreground">Discover and book tickets for the latest movies</p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search films by title or genre..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[2/3] bg-muted animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-6 bg-muted rounded mb-2 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredFilms && filteredFilms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFilms.map((film) => (
              <Link key={film.id} href={`/films/${film.id}`} data-testid={`link-film-${film.id}`}>
                <Card className="group overflow-hidden hover-elevate cursor-pointer h-full" data-testid={`card-film-${film.id}`}>
                  <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                    {film.poster_url ? (
                      <img
                        src={film.poster_url}
                        alt={film.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No poster
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                      <Button variant="secondary" size="sm">View Details</Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-1 line-clamp-1">{film.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">{film.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{film.duration_min} min</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                        {film.genre}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No films found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}
