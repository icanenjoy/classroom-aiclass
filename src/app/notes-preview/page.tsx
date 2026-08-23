import NotesPanel from "@/components/NotesPanel";
import NotesDownloadButton from "@/components/NotesDownloadButton";

// 실제 sqld 페이지에 연결하기 전 컴포넌트 단독 확인용 임시 라우트.
// 연결 확정되면 삭제한다.
export default function NotesPreview() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-xl font-bold">노트 패널 미리보기</h1>
      <NotesPanel />
      <div className="mt-4">
        <NotesDownloadButton />
      </div>
    </main>
  );
}
