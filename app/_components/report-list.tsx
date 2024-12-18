"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Search } from "lucide-react";
import { FraudReport, Vote } from '@/types/fraud-types';

export function ReportList() {
  const [reports, setReports] = useState<FraudReport[]>([]);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch('/api/reports/types');
        const response = await res.json();
        
        if (!res.ok) {
          throw new Error(response.error || 'Failed to fetch report types');
        }
        
        setTypes(response.data || []);
      } catch (err) {
        console.error('Failed to fetch report types:', err);
      }
    };
    
    fetchTypes();
  }, []);

  const handleSearch = async (page = 1) => {
    setLoading(true);
    setHasSearched(true);
    
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        page: page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (selectedType && selectedType !== 'all') {
        params.append('type', selectedType);
      }
      
      const res = await fetch(`/api/reports/search?${params}`);
      const response = await res.json();
      
      if (!res.ok) {
        throw new Error(response.error || 'Failed to search reports');
      }
      
      setReports(response.data || []);
      setPagination(response.pagination);
      setError('');
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to search reports');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id: string, type: Vote['type']) => {
    try {
      await fetch(`/api/reports/${id}/vote`, {
        method: 'POST',
        body: JSON.stringify({ type }),
        headers: { 'Content-Type': 'application/json' },
      });
      // Refresh current page of results
      await handleSearch(pagination.page);
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search by identifier, description, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => handleSearch(1)} disabled={loading}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {error && (
        <div className="text-center py-4 text-red-500">
          {error}
        </div>
      )}

      {!hasSearched ? (
        <div className="text-center py-4 text-gray-500">
          Enter a search term to view reports
        </div>
      ) : loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No reports found matching your search
        </div>
      ) : (
        <>
          <div className="h-[600px] overflow-y-auto space-y-4 pr-2">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <CardTitle>{report.type}: {report.identifier}</CardTitle>
                  <CardDescription>{new Date(report.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{report.description}</p>
                  {report.city && <p>Location: {report.city}, {report.street}</p>}
                </CardContent>
                <CardFooter className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleVote(report.id, 'UPVOTE')}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {report.votes.filter((v: Vote) => v.type === 'UPVOTE').length}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleVote(report.id, 'DOWNVOTE')}
                  >
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    {report.votes.filter((v: Vote) => v.type === 'DOWNVOTE').length}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === pagination.page ? "default" : "outline"}
                onClick={() => handleSearch(page)}
                disabled={loading}
              >
                {page}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ReportList;