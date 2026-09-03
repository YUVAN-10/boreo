import { useMemo, useState } from "react";
import MembersHeader from "../components/members/MembersHeader";
import MemberToolbar from "../components/members/MemberToolbar";
import MemberTable from "../components/members/MemberTable";
import Pagination from "../components/members/Pagination";
import EmptyMembersState from "../components/members/EmptyMembersState";
import { useMembers } from "../context/MembersContext";

const PAGE_SIZE = 10;
const DEFAULT_STATUS = "Active";

export default function Members() {
  const { members } = useMembers();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(DEFAULT_STATUS);
  const [sortBy, setSortBy] = useState("name-asc");
  const [page, setPage] = useState(1);

  const hasFilters = search.trim() !== "" || status !== DEFAULT_STATUS;

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = members.filter((member) => {
      const matchesQuery =
        query === "" ||
        member.fullName.toLowerCase().includes(query) ||
        member.ridNo.toLowerCase().includes(query) ||
        member.phone.includes(query) ||
        member.companyName.toLowerCase().includes(query);

      const matchesStatus = status === "all" || member.status === status;

      return matchesQuery && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name-desc":
          return b.fullName.localeCompare(a.fullName);
        case "joining-desc":
          return new Date(b.joiningDate) - new Date(a.joiningDate);
        case "joining-asc":
          return new Date(a.joiningDate) - new Date(b.joiningDate);
        case "name-asc":
        default:
          return a.fullName.localeCompare(b.fullName);
      }
    });

    return result;
  }, [members, search, status, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleClearFilters = () => {
    setSearch("");
    setStatus(DEFAULT_STATUS);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <MembersHeader />

      <MemberToolbar
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
      />

      {filteredMembers.length === 0 ? (
        <EmptyMembersState hasFilters={hasFilters} onClearFilters={handleClearFilters} />
      ) : (
        <div className="space-y-4 animate-fade-in">
          <MemberTable members={paginatedMembers} />
          <Pagination
            currentPage={currentPage}
            totalItems={filteredMembers.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
